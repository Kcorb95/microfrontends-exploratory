import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component (Pages Router)
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
