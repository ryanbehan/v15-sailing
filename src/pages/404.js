import Seo from '../components/Seo';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="This Vanguard 15 resource could not be found. Return to the homepage to explore sailing clubs, boat guides, replacement parts, and racing resources."
        noindex
      />
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
