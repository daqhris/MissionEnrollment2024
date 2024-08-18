// Load environment variables
require("dotenv").config();

// Import Hardhat plugins
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("@nomicfoundation/hardhat-verify");

// Add console log to check environment variable values
console.log('ALCHEMY_API_KEY:', process.env.ALCHEMY_API_KEY);
console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? '****' + process.env.PRIVATE_KEY.slice(-4) : 'undefined');
console.log('BLOCKSCOUT_API_KEY:', process.env.BLOCKSCOUT_API_KEY ? '****' + process.env.BLOCKSCOUT_API_KEY.slice(-4) : 'undefined');
console.log('DEPLOYER_ETH_ADDRESS:', process.env.DEPLOYER_ETH_ADDRESS);

// Ensure required environment variables are set
if (!process.env.ALCHEMY_API_KEY || !process.env.PRIVATE_KEY || !process.env.BLOCKSCOUT_API_KEY || !process.env.DEPLOYER_ETH_ADDRESS) {
  console.error("Please set ALCHEMY_API_KEY, PRIVATE_KEY, BLOCKSCOUT_API_KEY, and DEPLOYER_ETH_ADDRESS in your .env file");
  process.exit(1);
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:7545",
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
      gasPrice: 1000000000,
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia.basescan.org",
          apiKey: process.env.BLOCKSCOUT_API_KEY,
        },
      },
    },
    "optimism-sepolia": {
      url: "https://sepolia.optimism.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155420,
      gasPrice: 1000000000,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.BLOCKSCOUT_OPTIMISM_API_KEY,
    customChains: [
      {
        network: "optimism-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io"
        }
      }
    ]
  },
};
