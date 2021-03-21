import { expect } from "./setup"
import { l2ethers as ethers } from "hardhat"
import { Contract, Signer } from "ethers"

describe("ClickFuel", () => {
    let account1: Signer
    let account2: Signer
    let account3: Signer
    let account4: Signer
    let ClickFuel: Contract

    const googleId1 = "105809056115901676361"
    const googleId2 = "105806056115901676362"
    const googleId3 = "105805056115901676363"

    before(async () => {
        ;[account1, account2, account3, account4] = await ethers.getSigners()
    })

    beforeEach(async () => {
        ClickFuel = await (await ethers.getContractFactory("ClickFuel")).connect(account1).deploy()
    })

    describe("Deploy", () => {
        it("deploys the contract and token contract", async () => {
            expect(ClickFuel.address).to.exist
            expect(await ClickFuel.token()).to.exist
        })
    })

    describe("Token Transfer", () => {
        let tokenContract: Contract

        beforeEach(async () => {
            const tokenAddress = await ClickFuel.token()
            tokenContract = await ethers.getContractAt("FuelToken", tokenAddress)
        })

        it("should transfer token to user", async () => {
            const receiver = account2
            const receiverAddress = await account2.getAddress()

            await ClickFuel.connect(receiver).transferToken(googleId1)
            const receiverBalance = (await tokenContract.balanceOf(receiverAddress)).toNumber()

            expect(receiverBalance).to.eq(50)
        })

        it.skip("should revert when requesting token twice", async () => {
            const receiver = account2
            const receiver2 = account3

            await ClickFuel.connect(receiver).transferToken(googleId1)

            await expect(ClickFuel.connect(receiver).transferToken(googleId2)).to.be.revertedWith(
                "User faucet already"
            )

            await expect(ClickFuel.connect(receiver2).transferToken(googleId1)).to.be.revertedWith(
                "User faucet already"
            )
        })
    })

    describe("App interaction", () => {
        let tokenContract: Contract

        beforeEach(async () => {
            const tokenAddress = await ClickFuel.token()
            tokenContract = await ethers.getContractAt("FuelToken", tokenAddress)

            await ClickFuel.connect(account1).transferToken(googleId1)
            await ClickFuel.connect(account2).transferToken(googleId2)
            await ClickFuel.connect(account3).transferToken(googleId3)
        })

        it.skip("should revert when sender doesn't have enough balance to create post", async () => {
            const creator = account4
            await expect(
                ClickFuel.connect(creator).createPost("https://google.com")
            ).to.be.revertedWith("transfer amount exceeds balance")
        })

        it("should create a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 20)
            await ClickFuel.connect(creator).createPost("https://google.com")

            const post = await ClickFuel.allPosts(0)
            expect(post.detail).to.eq("https://google.com")

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(30)
        })

        it("should upvote for a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            const voter = account2
            const voterAddress = await voter.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 20)
            await ClickFuel.connect(creator).createPost("https://google.com")

            await tokenContract.connect(voter).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter).vote(true, 0)

            const post = await ClickFuel.allPosts(0)
            expect(post.flameCount.toNumber()).to.eq(21)

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(30)

            const voterBalance = (await tokenContract.balanceOf(voterAddress)).toNumber()
            expect(voterBalance).to.eq(49)
        })

        it("should downvote for a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            const voter = account2
            const voterAddress = await voter.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 20)
            await ClickFuel.connect(creator).createPost("https://google.com")

            await tokenContract.connect(voter).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter).vote(false, 0)

            const post = await ClickFuel.allPosts(0)
            expect(post.flameCount.toNumber()).to.eq(19)

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(30)

            const voterBalance = (await tokenContract.balanceOf(voterAddress)).toNumber()
            expect(voterBalance).to.eq(49)
        })

        it("should withdraw from a post downvoted post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            const voter = account2
            const voter1 = account3

            // create a post
            await tokenContract.connect(creator).approve(ClickFuel.address, 20)
            await ClickFuel.connect(creator).createPost("https://google.com")

            // downvote a post once
            await tokenContract.connect(voter).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter).vote(false, 0)

            // downvote a post twice
            await tokenContract.connect(voter1).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter1).vote(false, 0)

            let post = await ClickFuel.allPosts(0)
            expect(post.flameCount.toNumber()).to.eq(18)

            await ClickFuel.connect(creator).withdraw(0)
            post = await ClickFuel.allPosts(0)
            expect(post.flameCount.toNumber()).to.eq(0)

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(48)
        })
    })
})
