import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | V-15 Sailing</title>
      </Head>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4 text-navy-blue">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link href="/" className="text-sky-blue underline text-lg">
          Back to the homepage
        </Link>
      </div>
    </>
  );
}
