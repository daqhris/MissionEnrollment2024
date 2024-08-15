"use client";

import React from "react";
import type { AppProps } from "next/app";
import QueryClientProviderWrapper from "../components/QueryClientProviderWrapper";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}

const wagmiConfig = getDefaultConfig({
  appName: "Mission Enrollment",
  projectId,
  chains: [mainnet, sepolia],
});

// Configure Apollo Client
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

type MyAppProps = AppProps;

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <QueryClientProviderWrapper>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProviderWrapper>
  );
}

export default MyApp;
