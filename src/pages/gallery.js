import Head from 'next/head';

const sections = [
  {
    title: 'Vanguard 15 Fleet 53',
    blurb: 'Racing on San Francisco Bay — Thursday nights, team racing, and fleet championships.',
    linkText: 'vanguard15.org',
    linkUrl: 'https://vanguard15.org/photos/',
    photos: [
      { src: '/images/fleet53/planing-cityfront.jpg', alt: 'V15 planing past the San Francisco cityfront', caption: 'Planing past the cityfront' },
      { src: '/images/fleet53/bay-bridge-fleet.jpg', alt: 'V15 fleet racing under the Bay Bridge', caption: 'Fleet under the Bay Bridge' },
      { src: '/images/fleet53/fleet-start.jpg', alt: 'V15s at the start line', caption: 'At the start' },
      { src: '/images/fleet53/hiking-upwind.jpg', alt: 'Crew hiking hard upwind', caption: 'Hiking upwind' },
      { src: '/images/fleet53/cityfront-spinnakers.jpg', alt: 'Spinnakers up along the San Francisco waterfront', caption: 'Kites up on the cityfront' },
      { src: '/images/fleet53/upwind-crew.jpg', alt: 'V15 sailing upwind', caption: 'Upwind work' },
      { src: '/images/fleet53/rafted-dock.jpg', alt: 'V15s rafted at the dock after racing', caption: 'Back at the dock' },
    ],
  },
  {
    title: 'Connetquot River Dinghy Club',
    blurb: 'The frostbite fleet in Oakdale, NY — sailing select Sundays November through April.',
    linkText: 'crdc.v-15.org',
    linkUrl: 'https://crdc.v-15.org',
    photos: [
      { src: '/images/crdc/start-lineup.jpg', alt: 'V15s lined up at a start', caption: 'Lined up at the start' },
      { src: '/images/crdc/frostbite-fleet.jpg', alt: 'Frostbite fleet racing in winter', caption: 'Frostbite fleet racing' },
      { src: '/images/crdc/river-racing.jpg', alt: 'V15s racing on the Connetquot River', caption: 'Racing on the Connetquot River' },
      { src: '/images/crdc/fleet-upwind.jpg', alt: 'V15s sailing upwind', caption: 'Upwind leg' },
      { src: '/images/crdc/clubhouse-racing.jpg', alt: 'V15s racing past the clubhouse', caption: 'Past the clubhouse' },
      { src: '/images/crdc/capsize-recovery.jpg', alt: 'Sailor righting a capsized V15', caption: 'Righting a capsized boat' },
      { src: '/images/crdc/sailors-drysuits.jpg', alt: 'CRDC sailors in drysuits', caption: 'Drysuit season' },
      { src: '/images/crdc/misty-morning.jpg', alt: 'V15s sailing on a misty morning', caption: 'Misty morning' },
      { src: '/images/crdc/fleet-group-photo.jpg', alt: 'CRDC fleet sailors on shore', caption: 'The fleet ashore' },
      { src: '/images/crdc/snowy-boatyard.jpg', alt: 'Snowy CRDC boatyard', caption: 'The boatyard in winter' },
      { src: '/images/crdc/ice-covered-boats.jpg', alt: 'Ice-covered V15s', caption: 'Ice-covered hulls' },
    ],
  },
];

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery | V-15 Sailing</title>
        <meta name="description" content="Photos from Vanguard 15 fleets — Fleet 53 on San Francisco Bay and the CRDC frostbite fleet on the Connetquot River." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">Gallery</h1>
      {sections.map((s) => (
        <section key={s.title} className="mb-10">
          <h2 className="text-xl font-semibold mb-1">{s.title}</h2>
          <p className="mb-4 text-gray-700">
            {s.blurb}{' '}
            <a href={s.linkUrl} target="_blank" rel="noopener" className="text-sky-blue underline">
              {s.linkText}
            </a>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.photos.map((p) => (
              <figure key={p.src} className="m-0">
                <img src={p.src} alt={p.alt} className="rounded-lg shadow w-full h-56 object-cover" loading="lazy" />
                <figcaption className="text-sm text-gray-600 mt-1">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
