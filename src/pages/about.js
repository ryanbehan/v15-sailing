import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About | V-15 Sailing</title>
      </Head>
      <div className="max-w-3xl py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Info // About</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-6">About V-15 Sailing</h1>
        <p className="text-white/75 text-lg font-light">
          The Vanguard 15 is a high-performance two-person dinghy known for its speed, simplicity,
          and active one-design racing community. This site’s mission is to provide sailors with
          reliable resources—articles, parts sources, and regatta information—to keep the class
          thriving.
        </p>
        <p className="mt-4 text-white/75">
          This site is volunteer-supported by the Connetquot River Dinghy Club in New York.
        </p>
        <p className="mt-4 text-white/75">
          If you spot a correction or have an update, including an event to add, please email us at{' '}
          <a href="mailto:skipper@v-15.org" className="text-signal underline">
            skipper@v-15.org
          </a>
          .
        </p>
      </div>
    </>
  );
}
