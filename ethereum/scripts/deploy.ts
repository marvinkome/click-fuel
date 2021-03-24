import { l2ethers, ethers, artifacts } from "hardhat"
import fs from "fs"

function saveFrontendFiles() {
    const contractsDir = __dirname + "/../../src/artifacts"

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    const ClickFuelArtifact = artifacts.readArtifactSync("ClickFuel")
    fs.writeFileSync(
        contractsDir + "/ClickFuel.json",
        JSON.stringify(ClickFuelArtifact.abi, null, 2)
    )

    const FuelTokenArtifact = artifacts.readArtifactSync("FuelToken")
    fs.writeFileSync(
        contractsDir + "/FuelToken.json",
        JSON.stringify(FuelTokenArtifact.abi, null, 2)
    )
}

async function main() {
    const initialSupply = 50_000_000
    const [deployer] = await ethers.getSigners()

    console.log("Deploying contracts with the account: ", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    const FuelToken = await l2ethers.getContractFactory("FuelToken")
    const ClickFuel = await l2ethers.getContractFactory("ClickFuel")

    const fuelToken = await FuelToken.deploy(initialSupply)
    const clickFuel = await ClickFuel.deploy(fuelToken.address)

    await fuelToken.connect(deployer).transfer(clickFuel.address, initialSupply * 0.8)

    console.log("ClickFuel Contract address:", clickFuel.address)
    console.log("FuelToken Contract address:", fuelToken.address)

    saveFrontendFiles()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
