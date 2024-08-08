import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './_app';

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

// Add getStaticProps to ensure this page is statically generated
export async function getStaticProps() {
  return { props: {} };
}
