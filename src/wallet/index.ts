import * as ethers from "ethers"
import clickFuelABI from "artifacts/ClickFuel.json"
import fuelTokenABI from "artifacts/FuelToken.json"

const provider = new ethers.providers.JsonRpcProvider("https://kovan.optimism.io")

const address = process.env.NEXT_PUBLIC_CLICK_FUEL_CONTRACT_ADDRESS
const clickFuelContract = new ethers.Contract(address, clickFuelABI, provider)

const tokenAddress = process.env.NEXT_PUBLIC_FUEL_TOKEN_CONTRACT_ADDRESS
const tokenContract = new ethers.Contract(tokenAddress, fuelTokenABI, provider)

// WALLET
export async function getOVMBalance(wallet: ethers.Wallet) {
    const balance = (await tokenContract
        .connect(wallet.connect(provider))
        .balanceOf(wallet.address)) as ethers.BigNumber

    return balance.toNumber()
}

export async function transferToken(wallet: ethers.Wallet, address: string, amount: number) {
    await tokenContract.connect(wallet.connect(provider)).transfer(address, amount)
}

// CLICK FUEL
export async function getTokens(wallet: ethers.Wallet, googleId: string) {
    await clickFuelContract.connect(wallet.connect(provider)).transferToken(googleId)
}

export async function checkAccountVerification(wallet: ethers.Wallet) {
    return !!(await clickFuelContract
        .connect(wallet.connect(provider))
        .hasFaucetAddress(wallet.address))
}

export async function createLink(wallet: ethers.Wallet, link: string) {
    wallet = wallet.connect(provider)

    await tokenContract.connect(wallet).approve(clickFuelContract.address, 10)
    await clickFuelContract.connect(wallet).createPost(link)
}

export async function getLinks(wallet: ethers.Wallet) {
    wallet = wallet.connect(provider)

    const linkCount = (await clickFuelContract.connect(wallet).getPostsCount()) as number

    const links = await Promise.all(
        Array.from({ length: linkCount }).map((_, idx) => {
            return clickFuelContract.connect(wallet).allPosts(idx)
        })
    )

    return links.map((l, idx) => ({
        id: idx,
        creator: l.creator as string,
        link: l.detail as string,
        createdTime: (l.createdTime?.toNumber() || 0) as number,
        flameCount: (l.flameCount?.toNumber() || 0) as number,
    }))
}

export async function voteForPost(wallet: ethers.Wallet, upvote: boolean, postId: number) {
    wallet = wallet.connect(provider)

    await tokenContract.connect(wallet).approve(clickFuelContract.address, 10)
    await clickFuelContract.connect(wallet).vote(upvote, postId)
}

export async function getEarnings(wallet: ethers.Wallet) {
    return await clickFuelContract
        .connect(wallet.connect(provider))
        .totalEarnings(wallet.address)
        .toNumber()
}

export async function withdrawEarnings(wallet: ethers.Wallet) {
    await clickFuelContract.connect(wallet.connect(provider)).withdraw()
}
