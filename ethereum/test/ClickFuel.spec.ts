import { expect } from "./setup"
import { ethers } from "hardhat"
import { Contract, Signer } from "ethers"

describe("ClickFuel", () => {
    let account1: Signer
    let account2: Signer
    let account3: Signer
    let ClickFuel: Contract

    before(async () => {
        ;[account1, account2, account3] = await ethers.getSigners()
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

            await ClickFuel.connect(receiver).transferToken()
            const receiverBalance = (await tokenContract.balanceOf(receiverAddress)).toNumber()

            expect(receiverBalance).to.eq(10)
        })
    })

    describe("App interaction", () => {
        let tokenContract: Contract

        beforeEach(async () => {
            const tokenAddress = await ClickFuel.token()
            tokenContract = await ethers.getContractAt("FuelToken", tokenAddress)
            await ClickFuel.connect(account1).transferToken()
            await ClickFuel.connect(account2).transferToken()
        })

        it("should revert when sender doesn't have enough balance to create post", async () => {
            const creator = account3
            await expect(
                ClickFuel.connect(creator).createPost("https://google.com")
            ).to.be.revertedWith("transfer amount exceeds balance")
        })

        it("should create a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 2)
            await ClickFuel.connect(creator).createPost("https://google.com")

            const post = await ClickFuel.allPosts(0)
            expect(post.detail).to.eq("https://google.com")

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(8)
        })

        it("should upvote for a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            const voter = account2
            const voterAddress = await voter.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 2)
            await ClickFuel.connect(creator).createPost("https://google.com")

            await tokenContract.connect(voter).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter).vote(true, 0)

            const post = await ClickFuel.allPosts(0)
            expect(post.flameCount.toNumber()).to.eq(1)

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(8)

            const voterBalance = (await tokenContract.balanceOf(voterAddress)).toNumber()
            expect(voterBalance).to.eq(9)
        })

        it("should downvote for a post", async () => {
            const creator = account1
            const creatorAddress = await creator.getAddress()

            const voter = account2
            const voterAddress = await voter.getAddress()

            await tokenContract.connect(creator).approve(ClickFuel.address, 2)
            await ClickFuel.connect(creator).createPost("https://google.com")

            await tokenContract.connect(voter).approve(ClickFuel.address, 1)
            await ClickFuel.connect(voter).vote(false, 0)

            const post = await ClickFuel.allPosts(0)
            expect(post.freezeCount.toNumber()).to.eq(1)

            const creatorBalance = (await tokenContract.balanceOf(creatorAddress)).toNumber()
            expect(creatorBalance).to.eq(8)

            const voterBalance = (await tokenContract.balanceOf(voterAddress)).toNumber()
            expect(voterBalance).to.eq(9)
        })
    })
})
