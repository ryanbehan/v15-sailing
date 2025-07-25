import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>V-15 Sailing</title>
        <meta name="description" content="Resources, parts, and regatta info for Vanguard 15 sailors" />
      </Head>
      <section className="relative text-center py-32 md:py-40 bg-gradient-to-b from-sky-blue to-sunset-orange text-white overflow-hidden">
        <img
          src="/images/v15-boat.svg"
          alt="Vanguard 15 sailboat"
          className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Supporting the Vanguard 15 Sailing Community
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-light">
            Find articles, parts recommendations, and upcoming regattas—all in one place.
          </p>
        </div>
      </section>
    </>
  );
}
