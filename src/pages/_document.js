import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <body className="bg-ink text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
