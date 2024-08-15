"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("hardhat/config.js");
const plugins_js_1 = require("hardhat/plugins.js");
require("hardhat-deploy/dist/types.js");
require("hardhat/types/config.js");
require("hardhat/types/runtime.js");
const viem_1 = require("viem");
const getContractOrNull = hre => async (contractName, client_) => {
  if (typeof hre.deployments === "undefined") throw new Error("No deployment plugin installed");
  const deployment = await hre.deployments.getOrNull(contractName);
  if (!deployment) return null;
  const client = client_ ?? {
    public: await hre.viem.getPublicClient(),
    wallet: await hre.viem.getWalletClients().then(([c]) => c),
  };
  return (0, viem_1.getContract)({
    abi: deployment.abi,
    address: deployment.address,
    client,
  });
};
const getContract = hre => async (contractName, client) => {
  const contract = await hre.viem.getContractOrNull(contractName, client);
  if (contract === null) throw new Error(`No contract deployed with name: ${contractName}`);
  return contract;
};
const getNamedClients = hre => async () => {
  const publicClient = await hre.viem.getPublicClient();
  const namedAccounts = await hre.getNamedAccounts();
  const clients = {};
  for (const [name, address] of Object.entries(namedAccounts)) {
    const namedClient = await hre.viem.getWalletClient(address);
    clients[name] = {
      public: publicClient,
      wallet: namedClient,
      address: (0, viem_1.getAddress)(address),
      account: namedClient.account,
    };
  }
  return clients;
};
const getUnnamedClients = hre => async () => {
  const publicClient = await hre.viem.getPublicClient();
  const unnamedAccounts = await hre.getUnnamedAccounts();
  const clients = await Promise.all(
    unnamedAccounts.map(async address => {
      const unnamedClient = await hre.viem.getWalletClient(address);
      return {
        public: publicClient,
        wallet: unnamedClient,
        address: (0, viem_1.getAddress)(address),
        account: unnamedClient.account,
      };
    }),
  );
  return clients;
};
const waitForTransactionSuccess = hre => async hash => {
  const publicClient = await hre.viem.getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`Transaction failed: ${hash}`);
  return receipt;
};
const deploy = hre => async (contractName, args, options) => {
  const [defaultWalletClient] = await hre.viem.getWalletClients();
  const walletClient = options?.client?.wallet ?? defaultWalletClient;
  const legacyOptions = {
    args,
    from: walletClient.account.address,
    log: true,
    waitConfirmations: options?.confirmations,
    value: options?.value?.toString(),
    gasLimit: options?.gas?.toString(),
    gasPrice: options?.gasPrice?.toString(),
    maxFeePerGas: options?.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: options?.maxPriorityFeePerGas?.toString(),
    contract: options?.artifact,
  };
  if (hre.network.saveDeployments) return hre.deployments.deploy(contractName, legacyOptions);
  const diffResult = await hre.deployments.fetchIfDifferent(contractName, legacyOptions);
  if (!diffResult.differences) {
    const deployment = await hre.deployments.get(contractName);
    return {
      ...deployment,
      address: deployment.address,
      newlyDeployed: false,
    };
  }
  const artifact = options?.artifact ?? (await hre.artifacts.readArtifact(contractName));
  const deployHash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args,
    value: options?.value,
    gas: options?.gas,
    ...(options?.gasPrice
      ? {
          gasPrice: options?.gasPrice,
        }
      : {
          maxFeePerGas: options?.maxFeePerGas,
          maxPriorityFeePerGas: options?.maxPriorityFeePerGas,
        }),
  });
  console.log(`deploying "${contractName}" (tx: ${deployHash})...`);
  const receipt = await hre.viem.waitForTransactionSuccess(deployHash);
  console.log(`"${contractName}" deployed at: ${receipt.contractAddress} with ${receipt.gasUsed} gas`);
  const deployment = {
    address: receipt.contractAddress,
    abi: artifact.abi,
    receipt: {
      from: receipt.from,
      transactionHash: deployHash,
      blockHash: receipt.blockHash,
      blockNumber: Number(receipt.blockNumber),
      transactionIndex: receipt.transactionIndex,
      cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
      gasUsed: receipt.gasUsed.toString(),
      contractAddress: receipt.contractAddress,
      to: receipt.to ?? undefined,
      logs: receipt.logs.map(log => ({
        blockNumber: Number(log.blockNumber),
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        transactionIndex: log.transactionIndex,
        logIndex: log.logIndex,
        removed: log.removed,
        address: log.address,
        topics: log.topics,
        data: log.data,
      })),
      logsBloom: receipt.logsBloom,
      status: receipt.status === "success" ? 1 : 0,
    },
    transactionHash: deployHash,
    args,
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode,
  };
  await hre.deployments.save(contractName, deployment);
  return {
    ...deployment,
    newlyDeployed: true,
  };
};
(0, config_js_1.extendEnvironment)(hre => {
  const prevViem = hre.viem;
  hre.viem = (0, plugins_js_1.lazyObject)(() => {
    prevViem.getContractOrNull = getContractOrNull(hre);
    prevViem.getContract = getContract(hre);
    prevViem.getNamedClients = getNamedClients(hre);
    prevViem.getUnnamedClients = getUnnamedClients(hre);
    prevViem.waitForTransactionSuccess = waitForTransactionSuccess(hre);
    prevViem.deploy = deploy(hre);
    return prevViem;
  });
});
