require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AttestationService...");

  // Log environment variables
  console.log("EAS_CONTRACT_ADDRESS:", process.env.EAS_CONTRACT_ADDRESS);
  console.log("SCHEMA_REGISTRY_ADDRESS:", process.env.SCHEMA_REGISTRY_ADDRESS);

  // Get the contract factory
  const AttestationService = await ethers.getContractFactory("AttestationService");

  // Deploy the contract
  const attestationService = await AttestationService.deploy(
    process.env.EAS_CONTRACT_ADDRESS,
    process.env.SCHEMA_REGISTRY_ADDRESS,
    { gasLimit: 3000000 } // Increase gas limit for Optimism Sepolia
  );

  await attestationService.deployed();

  console.log("AttestationService deployed to:", attestationService.address);

  // Verify the contract on Blockscout for Optimism Sepolia
  if (process.env.BLOCKSCOUT_OPTIMISM_API_KEY) {
    console.log("Verifying contract on Blockscout...");
    try {
      await hre.run("verify:verify", {
        address: attestationService.address,
        constructorArguments: [process.env.EAS_CONTRACT_ADDRESS, process.env.SCHEMA_REGISTRY_ADDRESS],
        contract: "contracts/AttestationService.sol:AttestationService",
      });
      console.log("Contract verified on Blockscout");
    } catch (error) {
      console.error("Error verifying contract:", error);
      console.error("Error details:", error.message);
    }
  } else {
    console.log("Skipping contract verification: BLOCKSCOUT_OPTIMISM_API_KEY not set");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
