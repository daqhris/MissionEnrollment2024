require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AttestationService...");

  // Determine the correct SCHEMA_REGISTRY_ADDRESS based on the network
  let schemaRegistryAddress;
  if (hre.network.name === 'optimism-sepolia') {
    schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS_OPTIMISM_SEPOLIA;
  } else if (hre.network.name === 'base-sepolia') {
    schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS_BASE_SEPOLIA;
  } else {
    throw new Error(`Unsupported network: ${hre.network.name}`);
  }

  // Log environment variables
  console.log("EAS_CONTRACT_ADDRESS:", process.env.EAS_CONTRACT_ADDRESS);
  console.log("SCHEMA_REGISTRY_ADDRESS:", schemaRegistryAddress);

  // Get the contract factory
  const AttestationService = await ethers.getContractFactory("AttestationService");

  // Deploy the contract
  const attestationService = await AttestationService.deploy(
    process.env.EAS_CONTRACT_ADDRESS,
    schemaRegistryAddress,
    { gasLimit: 3000000 } // Increase gas limit for L2 networks
  );

  await attestationService.deployed();

  console.log("AttestationService deployed to:", attestationService.address);

  // Verify the contract
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: attestationService.address,
        constructorArguments: [process.env.EAS_CONTRACT_ADDRESS, schemaRegistryAddress],
        contract: "contracts/AttestationService.sol:AttestationService",
      });
      console.log("Contract verified");
    } catch (error) {
      console.error("Error verifying contract:", error);
      console.error("Error details:", error.message);
    }
  } else {
    console.log("Skipping contract verification: ETHERSCAN_API_KEY not set");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
