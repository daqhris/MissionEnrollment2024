import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string })]
);

const { connectors } = getDefaultWallets({
  appName: "Mission Enrollment",
  projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  chains
});

// Configure Apollo Client
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default MyApp;
