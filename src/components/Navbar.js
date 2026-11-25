import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const dropdowns = {
  guides: {
    label: 'Guides',
    items: [
      { href: '/guides/fleet-development', label: 'Fleet Development' },
      { href: '/guides/maintenance', label: 'Maintenance' },
      { href: '/guides/racing', label: 'Racing' },
      { href: '/guides/rigging', label: 'Rigging' },
      { href: '/guides/tuning', label: 'Tuning' },
      { href: '/guides', label: 'All Guides' },
    ],
  },
  articles: {
    label: 'Articles',
    items: [
      { href: '/articles/contacts', label: 'Contacts', testid: 'nav-articles-contacts' },
      { href: '/articles/rules', label: 'Class Rules' },
      { href: '/articles/part-finder', label: 'Part Finder' },
      { href: '/articles', label: 'All Articles' },
    ],
  },
  parts: {
    label: 'Parts',
    items: [
      { href: '/parts/hull-hardware', label: 'Hull Hardware' },
      { href: '/parts/spars', label: 'Spars' },
      { href: '/parts/running-rigging', label: 'Running Rigging' },
      { href: '/parts/sails', label: 'Sails' },
      { href: '/parts/vendors', label: 'Vendors' },
      { href: '/parts/part-numbers', label: 'Part Numbers' },
      { href: '/parts/catalog', label: 'Parts Finder' },
    ],
  },
};

const linkClass =
  'block py-2 lg:py-0 font-mono text-xs uppercase tracking-[0.15em] xl:tracking-[0.2em] text-white/80 hover:text-signal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal';
const triggerClass = `${linkClass} cursor-pointer flex items-center gap-1`;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
      <img
        src="/images/vanguard-15-logo.png"
        alt="Vanguard 15 logo"
        width="390"
        height="291"
        className="h-[54px] w-auto drop-shadow-[0_0_1px_rgba(255,255,255,0.95)]"
      />
      <span className="text-xl font-black uppercase tracking-tight">
        V15<span className="text-race-red"> Sailing</span>
      </span>
    </Link>
  );
}

function NavItems({ menu, openMenu, closeMenu, mobile = false }) {
  return (
    <ul className="lg:flex lg:items-center lg:gap-5 xl:gap-6">
      <li><Link href="/articles/clubs" className={linkClass}>Clubs</Link></li>
      {Object.entries(dropdowns).map(([key, { label, items }]) => (
        <li className="relative" key={key}>
          <button
            type="button"
            className={triggerClass}
            data-testid={`nav-${key}${mobile ? '-mobile' : ''}`}
            data-menu-trigger={key}
            onClick={() => (menu === key ? closeMenu() : openMenu(key))}
            onKeyDown={(e) => { if (e.key === 'Escape') closeMenu(key); }}
            aria-haspopup="true"
            aria-expanded={menu === key}
          >
            {label}
            <svg className="w-3 h-3 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul
            className={`lg:absolute lg:right-0 ${menu === key ? 'block' : 'hidden'} bg-panel border border-white/10 lg:mt-3 z-10 min-w-[200px]`}
            onKeyDown={(e) => { if (e.key === 'Escape') closeMenu(key); }}
          >
            {items.map((item) => (
              <li key={item.href} className="border-b border-white/10 last:border-0">
                <Link
                  href={item.href}
                  data-testid={item.testid && `${item.testid}${mobile ? '-mobile' : ''}`}
                  className="block px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-white/70 hover:bg-signal hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li><Link href="/regattas" className={linkClass}>Regattas</Link></li>
      <li><Link href="/gallery" className={linkClass}>Gallery</Link></li>
      <li><Link href="/about" className={linkClass}>About</Link></li>
    </ul>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const headerRef = useRef(null);

  const closeMenu = (focusKey) => {
    setMenu(null);
    if (focusKey) {
      const triggers = headerRef.current?.querySelectorAll(`[data-menu-trigger="${focusKey}"]`);
      Array.from(triggers || []).find((trigger) => trigger.getClientRects().length)?.focus();
    }
  };
  const openMenu = (key) => setMenu(key);

  useEffect(() => {
    const closeAll = () => { setMenu(null); setMobileOpen(false); };
    router.events.on('routeChangeStart', closeAll);
    return () => router.events.off('routeChangeStart', closeAll);
  }, [router.events]);

  useEffect(() => {
    if (!menu && !mobileOpen) return undefined;
    const onPointerDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menu, mobileOpen]);

  return (
    <header ref={headerRef} className="bg-ink border-b-2 border-signal relative z-50">
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden lg:block w-6 h-px bg-signal" aria-hidden="true" />
          <Logo />
        </div>
        <nav className="hidden lg:block" aria-label="Primary">
          <NavItems menu={menu} openMenu={openMenu} closeMenu={closeMenu} />
        </nav>
        <button
          type="button"
          className="lg:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal p-1"
          onClick={() => setMobileOpen((o) => !o)}
          onKeyDown={(e) => { if (e.key === 'Escape') setMobileOpen(false); }}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <nav
        className={`lg:hidden container mx-auto px-4 border-t border-white/10 ${mobileOpen ? 'block py-3' : 'hidden'}`}
        aria-label="Mobile"
      >
        <NavItems menu={menu} openMenu={openMenu} closeMenu={closeMenu} mobile />
      </nav>
    </header>
  );
}
