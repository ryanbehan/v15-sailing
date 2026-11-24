import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" sizes="71x61" href="/images/v15-logo.png" />
      </Head>
      <body className="bg-ink text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
