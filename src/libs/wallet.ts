import { NextPageContext } from "next"
import { Wallet } from "ethers"

export function getWallet(ctx: NextPageContext, serverSide: boolean) {
    return Wallet.createRandom()
}
