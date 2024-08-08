import React from 'react';
import { NextPageContext } from 'next';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './_app';

interface ErrorProps {
  statusCode?: number;
}

const Error = ({ statusCode }: ErrorProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Error {statusCode}</h1>
        <p>
          {statusCode
            ? 'An error ' + statusCode + ' occurred on server'
            : 'An error occurred on client'}
        </p>
      </div>
    </QueryClientProvider>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
