import React from "react";
import type { AppProps } from "next/app";
import QueryClientProviderWrapper from "../components/QueryClientProviderWrapper";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// Configure chains & providers
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Configure Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

type MyAppProps = AppProps;

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <QueryClientProviderWrapper>
      <WagmiConfig config={config}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </WagmiConfig>
    </QueryClientProviderWrapper>
  );
}

export default MyApp;
