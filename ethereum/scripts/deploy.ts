import { l2ethers, ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log("Deploying contracts with the account: ", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const ClickFuel = await l2ethers.getContractFactory("ClickFuel")

    const clickFuel = await ClickFuel.deploy()
    console.log("ClickFuel Contract address:", clickFuel.address)

    const token = await clickFuel.token()
    console.log("FuelToken Contract address:", token)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
