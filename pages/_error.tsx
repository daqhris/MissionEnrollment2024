import React from "react";
import type { NextPageContext } from "next";

interface ErrorProps {
  statusCode: number;
}

const Error = ({ statusCode }: ErrorProps): React.ReactElement => {
  return (
    <div>
      <h1>Error {statusCode}</h1>
      <p>{statusCode ? "An error " + statusCode + " occurred on server" : "An error occurred on client"}</p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): Promise<ErrorProps> => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return Promise.resolve({ statusCode: statusCode ?? 404 });
};

export default Error;
