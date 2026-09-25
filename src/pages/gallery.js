import Head from 'next/head';

const photos = [
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
];

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery | V-15 Sailing</title>
        <meta name="description" content="Photos from Vanguard 15 fleets — frostbiting and racing at Connetquot River Dinghy Club." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">Gallery</h1>
      <p className="mb-6 text-gray-700">
        Photos from the{' '}
        <a href="https://crdc.v-15.org" target="_blank" rel="noopener" className="text-sky-blue underline">
          Connetquot River Dinghy Club
        </a>
        {' '}frostbite fleet in Oakdale, NY.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <figure key={p.src} className="m-0">
            <img src={p.src} alt={p.alt} className="rounded-lg shadow w-full h-56 object-cover" loading="lazy" />
            <figcaption className="text-sm text-gray-600 mt-1">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
