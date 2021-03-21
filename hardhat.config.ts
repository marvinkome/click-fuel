require("dotenv").config({ path: ".env.local" })
import { HardhatUserConfig } from "hardhat/types"
import { task } from "hardhat/config"

import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@eth-optimism/plugins/hardhat/compiler"
import "@eth-optimism/plugins/hardhat/ethers"

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.
if (process.env.NODE_ENV !== "production") {
    task("faucet", "Sends ETH and tokens to an address")
        .addPositionalParam("receiver", "The address that will receive them")
        .setAction(async ({ receiver }, hre) => {
            if (hre.network.name === "hardhat") {
                console.warn(
                    "You are running the faucet task with Hardhat network, which" +
                        "gets automatically created and destroyed every time. Use the Hardhat" +
                        " option '--network localhost'"
                )
            }

            const [sender] = await hre.ethers.getSigners()

            const tx2 = await sender.sendTransaction({
                to: receiver,
                value: hre.ethers.constants.WeiPerEther.mul(hre.ethers.BigNumber.from(50)),
            })
            await tx2.wait()

            console.log(`Transferred 50 ETH ${receiver}`)
        })
}

const config: HardhatUserConfig = {
    solidity: "0.7.3",
    networks: {
        kovenOE: {
            url: "https://kovan.optimism.io",
            accounts: {
                mnemonic: process.env.mnemonic,
            },
        },
    },
    paths: {
        root: "./ethereum",
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}

export default config
