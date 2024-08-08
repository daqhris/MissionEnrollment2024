import React from "react";
import { getQueryClient } from "./_app";
import { QueryClientProvider, dehydrate } from "@tanstack/react-query";

const Custom404: React.FC = () => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </QueryClientProvider>
  );
};

export default Custom404;

// Ensure the page is statically generated
export const getStaticProps = async () => {
  const queryClient = getQueryClient();

  // Prefetch any necessary data here if needed
  // await queryClient.prefetchQuery(['someKey'], fetchSomeData);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
