import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

// Create QueryClient options
const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
};

// Module-level variable to store the QueryClient instance
let queryClientInstance: QueryClient | null = null;

// Function to get or create QueryClient
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server-side: Always create a new QueryClient
    return new QueryClient(queryClientOptions);
  } else {
    // Client-side: Create the QueryClient once in the client
    if (!queryClientInstance) {
      queryClientInstance = new QueryClient(queryClientOptions);
    }
    return queryClientInstance;
  }
}

type MyAppProps = AppProps & {
  pageProps: {
    dehydratedState?: DehydratedState;
  };
};

function MyApp({ Component, pageProps }: MyAppProps) {
  const queryClient = getQueryClient();

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
