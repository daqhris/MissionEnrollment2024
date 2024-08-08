import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../utils/queryClient';

function Error({ statusCode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </QueryClientProvider>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
