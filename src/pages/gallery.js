import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';

const sections = [
  {
    title: 'Connetquot River Dinghy Club',
    blurb: 'Sailing and shore scenes from CRDC in Oakdale, New York.',
    linkText: 'crdc.v-15.org',
    linkUrl: 'https://crdc.v-15.org',
    photos: [
      { src: '/images/crdc/race-line.jpg', alt: 'Vanguard 15s lining up to race at CRDC', caption: 'Lining up to race at CRDC', position: 'center bottom' },
      { src: '/images/crdc/crdc-fleet.jpg', alt: 'Vanguard 15 fleet gathering on the water at CRDC', caption: 'The CRDC fleet on the water' },
      { src: '/images/crdc/fleet-1.jpg', alt: 'Vanguard 15s racing across the river at CRDC', caption: 'Racing across the river at CRDC' },
      { src: '/images/crdc/flying.jpg', alt: 'Sailors hiking out at CRDC', caption: 'Hiking out at CRDC', position: 'center 70%' },
      { src: '/images/crdc/frostbite-fleet.jpg', alt: 'CRDC frostbite fleet sailing on the Connetquot River', caption: 'CRDC frostbite fleet' },
      { src: '/images/crdc/river-racing.jpg', alt: 'Vanguard 15s racing on the Connetquot River at CRDC', caption: 'Racing on the Connetquot River at CRDC' },
      { src: '/images/crdc/fleet-upwind.jpg', alt: 'Vanguard 15 fleet sailing at CRDC', caption: 'Fleet sailing at CRDC' },
      { src: '/images/crdc/clubhouse-racing.jpg', alt: 'Dinghies racing along the waterfront at CRDC', caption: 'Waterfront racing at CRDC' },
      { src: '/images/crdc/capsize-recovery.jpg', alt: 'Sailors recovering a capsized dinghy at CRDC', caption: 'Capsize recovery at CRDC' },
      { src: '/images/crdc/sailors-drysuits.jpg', alt: 'CRDC sailors in drysuits', caption: 'Drysuit season at CRDC' },
      { src: '/images/crdc/misty-morning.jpg', alt: 'Vanguard 15s sailing under cloudy skies at CRDC', caption: 'Cloudy-day sailing at CRDC' },
      { src: '/images/crdc/fleet-group-photo.jpg', alt: 'CRDC fleet sailors on shore', caption: 'The CRDC fleet ashore' },
      { src: '/images/crdc/snowy-boatyard.jpg', alt: 'Snowy CRDC boatyard', caption: 'The CRDC boatyard in winter' },
      { src: '/images/crdc/ice-covered-boats.jpg', alt: 'Snow and ice covering boats at CRDC', caption: 'Winter ashore at CRDC' },
    ],
  },
  {
    title: 'Archive — location unconfirmed',
    blurb: 'Club, event and location are not confirmed for these archive photos. They are not presented as photos of a particular fleet or regatta.',
    linkText: 'Source archive',
    linkUrl: 'https://vanguard15.org/photos/',
    photos: [
      { src: '/images/fleet53/fleet-start.jpg', alt: 'Vanguard 15s sailing together; location unconfirmed', caption: 'Vanguard 15 fleet — location unconfirmed' },
      { src: '/images/fleet53/hiking-upwind.jpg', alt: 'Vanguard 15s lined up on the water; location unconfirmed', caption: 'Fleet lined up — location unconfirmed' },
      { src: '/images/fleet53/upwind-crew.jpg', alt: 'Dinghy crews sailing near a wooded shoreline; location unconfirmed', caption: 'Crews under sail — location unconfirmed' },
    ],
  },
];

export default function Gallery() {
  return (
    <>
      <Seo
        title="Vanguard 15 Sailing Photos"
        description="Sailing and shore photos from Connetquot River Dinghy Club, plus archive photographs whose club, event and location await verification."
        path="/gallery/"
        type="CollectionPage"
      />
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Media / Gallery</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Gallery</h1>
        {sections.map((s) => (
          <section key={s.title} className="mb-12">
            <SectionHeading className="text-xl font-bold uppercase tracking-wide mb-1">{s.title}</SectionHeading>
            <p className="mb-5 text-white/60">
              {s.blurb}{' '}
              <a href={s.linkUrl} target="_blank" rel="noopener" className="text-signal underline">
                {s.linkText}
              </a>
            </p>
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {s.photos.map((p) => (
                <figure key={p.src} className="m-0">
                  <img src={p.src} alt={p.alt} className="w-full h-56 object-cover" style={{ objectPosition: p.position || 'center' }} loading="lazy" decoding="async" />
                  <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mt-2 mb-4">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
