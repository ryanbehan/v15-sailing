import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/v15-logo.png" />
      </Head>
      <body className="bg-white text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
