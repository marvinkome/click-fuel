import { ethers } from "hardhat"

async function main() {
    const initialSupply = 50_000_000
    const [deployer] = await ethers.getSigners()

    console.log("Deploying contracts with the account: ", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const FuelToken = await ethers.getContractFactory("FuelToken")
    const ClickFuel = await ethers.getContractFactory("ClickFuel")

    const fuelToken = await FuelToken.deploy(initialSupply)
    const clickFuel = await ClickFuel.deploy(fuelToken.address)

    await fuelToken.connect(deployer).transfer(clickFuel.address, initialSupply * 0.8)

    console.log("ClickFuel Contract address:", clickFuel.address)
    console.log("FuelToken Contract address:", fuelToken.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
