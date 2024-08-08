import React from "react";
import { getQueryClient } from "./_app";
import { QueryClientProvider } from "@tanstack/react-query";
import { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

const Error = ({ statusCode }: ErrorProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Error {statusCode}</h1>
        <p>{statusCode ? "An error " + statusCode + " occurred on server" : "An error occurred on client"}</p>
      </div>
    </QueryClientProvider>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
