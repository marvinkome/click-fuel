require("dotenv").config({ path: ".env.local" })
import { HardhatUserConfig } from "hardhat/types"

import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@eth-optimism/plugins/hardhat/compiler"
import "@eth-optimism/plugins/hardhat/ethers"

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
