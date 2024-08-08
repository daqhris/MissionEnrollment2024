import React from 'react';
import { QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from './_app';

const CustomNotFoundPage: React.FC = () => {
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

export default CustomNotFoundPage;

export async function getStaticProps() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['notFoundData'], () => Promise.resolve({}));
  return { 
    props: {
      dehydratedState: dehydrate(queryClient),
    } 
  };
}

// Explicitly export a config object to disable automatic static optimization
export const config = {
  unstable_runtimeJS: true,
};
