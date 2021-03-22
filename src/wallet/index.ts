import * as ethers from "ethers"

// const provider = new ethers.providers.JsonRpcProvider("https://kovan.optimism.io")
const provider = new ethers.providers.JsonRpcProvider()

const address = process.env.NEXT_PUBLIC_CLICK_FUEL_CONTRACT_ADDRESS
const abi = require("../../ethereum/artifacts/contracts/ClickFuel.sol/ClickFuel-ovm.json").abi
const clickFuelContract = new ethers.Contract(address, abi, provider)

const tokenAddress = process.env.NEXT_PUBLIC_FUEL_TOKEN_CONTRACT_ADDRESS
const tokenAbi = require("../../ethereum/artifacts/contracts/ClickFuel.sol/FuelToken-ovm.json").abi
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider)

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
