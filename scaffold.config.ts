import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  onlyLocalBurnerWallet: boolean;
  walletConnectProjectId: string;
  alchemyApiKey: string;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.baseSepolia, chains.optimismSepolia],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  // WalletConnect Project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLET_CONNECT_PROJECT_ID",

  // Alchemy API Key
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "YOUR_ALCHEMY_API_KEY",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
