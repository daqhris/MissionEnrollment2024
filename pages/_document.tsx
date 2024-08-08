import Document, { Html, Head, Main, NextScript } from 'next/document';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

class MyDocument extends Document {
  render() {
    const queryClient = new QueryClient();

    return (
      <Html lang="en">
        <Head />
        <body>
          <QueryClientProvider client={queryClient}>
            <Main />
          </QueryClientProvider>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
