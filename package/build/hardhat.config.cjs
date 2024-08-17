"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.archivedDeploymentPath = void 0;
// from @nomicfoundation/hardhat-toolbox-viem to avoid module issue
require("@nomicfoundation/hardhat-ignition-viem");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-viem");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("./tasks/hardhat-deploy-viem.cjs");
const dotenv_1 = __importDefault(require("dotenv"));
require("hardhat-abi-exporter");
require("hardhat-contract-sizer");
require("hardhat-deploy");
import("@ensdomains/hardhat-chai-matchers-viem");
// hardhat actions
require("./tasks/esm_fix.cjs");
// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
dotenv_1.default.config({ debug: false });
let real_accounts = undefined;
if (process.env.DEPLOYER_KEY) {
  real_accounts = [process.env.DEPLOYER_KEY, process.env.OWNER_KEY || process.env.DEPLOYER_KEY];
}
// circular dependency shared with actions
exports.archivedDeploymentPath = "./deployments/archive";
const config = {
  networks: {
    hardhat: {
      saveDeployments: false,
      tags: ["test", "legacy", "use_root"],
      allowUnlimitedContractSize: false,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      saveDeployments: false,
      tags: ["test", "legacy", "use_root"],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      tags: ["test", "legacy", "use_root"],
      chainId: 4,
      accounts: real_accounts,
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      tags: ["test", "legacy", "use_root"],
      chainId: 3,
      accounts: real_accounts,
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      tags: ["test", "legacy", "use_root"],
      chainId: 5,
      accounts: real_accounts,
    },
    sepolia: {
      url: `https://eth-sepolia.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      tags: ["test", "legacy", "use_root"],
      chainId: 11155111,
      accounts: real_accounts,
    },
    holesky: {
      url: `https://holesky-rpc.nocturnode.tech`,
      tags: ["test", "legacy", "use_root"],
      chainId: 17000,
      accounts: real_accounts,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      tags: ["legacy", "use_root"],
      chainId: 1,
      accounts: real_accounts,
    },
  },
  mocha: {},
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1200,
          },
        },
      },
      // for DummyOldResolver contract
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  abiExporter: {
    path: "./build/contracts",
    runOnCompile: true,
    clear: true,
    flat: true,
    except: ["Controllable$", "INameWrapper$", "SHA1$", "Ownable$", "NameResolver$", "TestBytesUtils$", "legacy/*"],
    spacing: 2,
    pretty: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 1,
      1: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
    },
  },
  external: {
    contracts: [
      {
        artifacts: [exports.archivedDeploymentPath],
      },
    ],
  },
};
exports.default = config;
