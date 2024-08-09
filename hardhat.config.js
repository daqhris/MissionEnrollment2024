// Load environment variables
require('dotenv').config();

// Ensure required environment variables are set
if (!process.env.INFURA_API_KEY || !process.env.PRIVATE_KEY) {
  console.error('Please set INFURA_API_KEY and PRIVATE_KEY in your .env file');
  process.exit(1);
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:7545"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42
    },
    // Configuration for other networks can be added here
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Add any additional plugins or configurations needed
};
