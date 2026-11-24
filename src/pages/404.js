import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | V-15 Sailing</title>
      </Head>
      <div className="text-center py-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Error // 404</p>
        <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Page Not Found</h1>
        <p className="text-lg text-white/60 mb-8">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-signal hover:bg-signal-dark text-white font-bold uppercase tracking-wide px-6 py-3 transition"
        >
          Back to the homepage
        </Link>
      </div>
    </>
  );
}
