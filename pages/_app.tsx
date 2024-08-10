import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import getQueryClient from "../utils/queryClient";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DehydratedState, HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

type MyAppProps = AppProps & {
  pageProps: {
    dehydratedState?: DehydratedState;
  };
};

function MyApp({ Component, pageProps }: MyAppProps) {
  console.log("MyApp rendering");
  const queryClient = getQueryClient();
  console.log("QueryClient obtained:", queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <WagmiConfig config={config}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </WagmiConfig>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
