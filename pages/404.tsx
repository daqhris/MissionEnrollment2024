import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../utils/queryClient';

const Custom404: React.FC = () => {
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
