import type { Chain } from "viem";
import { mainnet, goerli, sepolia, optimism, optimismGoerli, optimismSepolia, arbitrum, arbitrumGoerli, arbitrumSepolia, polygon, polygonMumbai, base, baseGoerli, baseSepolia, hardhat, gnosis, fantom, fantomTestnet, scrollSepolia } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

type ChainAttributes = {
  color: string | [string, string];
  nativeCurrencyTokenAddress?: string;
};

export type ChainWithAttributes = Chain & Partial<ChainAttributes>;

export const chains = {
  mainnet, goerli, sepolia, optimism, optimismGoerli, optimismSepolia, arbitrum, arbitrumGoerli, arbitrumSepolia, polygon, polygonMumbai, base, baseGoerli, baseSepolia, hardhat, gnosis, fantom, fantomTestnet, scrollSepolia
};

export const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.mainnet.id]: "eth-mainnet",
  [chains.goerli.id]: "eth-goerli",
  [chains.sepolia.id]: "eth-sepolia",
  [chains.optimism.id]: "opt-mainnet",
  [chains.optimismGoerli.id]: "opt-goerli",
  [chains.optimismSepolia.id]: "opt-sepolia",
  [chains.arbitrum.id]: "arb-mainnet",
  [chains.arbitrumGoerli.id]: "arb-goerli",
  [chains.arbitrumSepolia.id]: "arb-sepolia",
  [chains.polygon.id]: "polygon-mainnet",
  [chains.polygonMumbai.id]: "polygon-mumbai",
  [chains.base.id]: "base-mainnet",
  [chains.baseGoerli.id]: "base-goerli",
  [chains.baseSepolia.id]: "base-sepolia",
};

export const getAlchemyHttpUrl = (chainId: number): string | undefined => {
  return RPC_CHAIN_NAMES[chainId]
    ? `https://${RPC_CHAIN_NAMES[chainId]}.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`
    : undefined;
};

export const NETWORKS_EXTRA_DATA: Record<number, ChainAttributes> = {
  [chains.hardhat.id]: { color: "#b8af0c" },
  [chains.mainnet.id]: { color: "#ff8b9e" },
  [chains.sepolia.id]: { color: ["#5f4bb6", "#87ff65"] },
  [chains.gnosis.id]: { color: "#48a9a6" },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  [chains.polygonMumbai.id]: {
    color: "#92D9FA",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  [chains.optimismSepolia.id]: { color: "#f01a37" },
  [chains.optimism.id]: { color: "#f01a37" },
  [chains.arbitrumSepolia.id]: { color: "#28a0f0" },
  [chains.arbitrum.id]: { color: "#28a0f0" },
  [chains.fantom.id]: { color: "#1969ff" },
  [chains.fantomTestnet.id]: { color: "#1969ff" },
  [chains.scrollSepolia.id]: { color: "#fbebd4" },
};

export function getBlockExplorerTxLink(chainId: number, txnHash: string): string {
  const chainNames = Object.keys(chains);
  const targetChain = chainNames.find(chainName => chains[chainName as keyof typeof chains].id === chainId);

  if (!targetChain) return "";

  const blockExplorerTxURL = chains[targetChain as keyof typeof chains]?.blockExplorers?.default?.url;
  return blockExplorerTxURL ? `${blockExplorerTxURL}/tx/${txnHash}` : "";
}

export function getBlockExplorerAddressLink(network: Chain, address: string): string {
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  return blockExplorerBaseURL
    ? `${blockExplorerBaseURL}/address/${address}`
    : `https://etherscan.io/address/${address}`;
}

export function getTargetNetworks(): ChainWithAttributes[] {
  return scaffoldConfig.targetNetworks.map(targetNetwork => ({
    ...targetNetwork,
    ...NETWORKS_EXTRA_DATA[targetNetwork.id],
  }));
}
