const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

const MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS = '0xF0bC5CC2B4866dAAeCb069430c60b24520077037';

async function deployContract(network) {
  console.log(`Deploying AttestationService to ${network}...`);

  const AttestationService = await ethers.getContractFactory("AttestationService");

  let easAddress, schemaRegistryAddress;

  if (network === 'base-sepolia') {
    easAddress = process.env.EAS_ADDRESS_BASE_SEPOLIA;
    schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS_BASE_SEPOLIA;
  } else if (network === 'optimism-sepolia') {
    easAddress = process.env.EAS_ADDRESS_OPTIMISM_SEPOLIA;
    schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS_OPTIMISM_SEPOLIA;
  } else {
    throw new Error(`Unsupported network: ${network}`);
  }

  if (!easAddress || !schemaRegistryAddress) {
    throw new Error(`Missing EAS or SchemaRegistry address for network: ${network}`);
  }

  console.log(`EAS Address: ${easAddress}`);
  console.log(`SchemaRegistry Address: ${schemaRegistryAddress}`);

  const attestationService = await upgrades.deployProxy(AttestationService,
    [easAddress, schemaRegistryAddress],
    {
      kind: 'uups',
      initializer: 'initialize'
    }
  );

  await attestationService.waitForDeployment();

  const proxyAddress = await attestationService.getAddress();
  console.log(`AttestationService proxy deployed to: ${proxyAddress}`);
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log(`Implementation address: ${implementationAddress}`);

  return { proxy: proxyAddress, implementation: implementationAddress };
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const networks = ['base-sepolia', 'optimism-sepolia'];
  const deployments = {};

  for (const network of networks) {
    console.log(`\nDeploying to ${network}...`);
    try {
      deployments[network] = await deployContract(network);
      console.log(`Deployment to ${network} successful.`);
    } catch (error) {
      console.error(`Error deploying to ${network}:`, error);
    }
  }

  console.log("\nDeployment Summary:");
  for (const [network, addresses] of Object.entries(deployments)) {
    console.log(`${network}:`);
    console.log(`  Proxy: ${addresses.proxy}`);
    console.log(`  Implementation: ${addresses.implementation}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
