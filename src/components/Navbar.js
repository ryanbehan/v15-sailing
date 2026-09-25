import Link from 'next/link';
import { useState } from 'react';

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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(null);

  return (
    <header className="bg-navy-blue text-white relative z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/images/v15-logo.png" alt="Vanguard 15 logo" className="h-8 w-auto" />
          <span>V-15 Sailing</span>
        </Link>
        <button
          type="button"
          className="sm:hidden focus:outline-none"
          onClick={() => setMobileOpen((o) => !o)}
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
        <ul className={`sm:flex space-x-4 ${mobileOpen ? 'block' : 'hidden'} sm:block mt-4 sm:mt-0`}>
          <li><Link href="/articles/clubs" className="hover:text-sky-blue">Clubs</Link></li>
          {Object.entries(dropdowns).map(([key, { label, items }]) => (
            <li className="relative" key={key}>
              <button
                type="button"
                className="hover:text-sky-blue cursor-pointer"
                data-testid={`nav-${key}`}
                onClick={() => setMenu(menu === key ? null : key)}
                onKeyDown={(e) => { if (e.key === 'Escape') setMenu(null); }}
                aria-haspopup="true"
                aria-expanded={menu === key}
              >
                {label}
              </button>
              <ul
                className={`sm:absolute left-0 ${menu === key ? 'block' : 'hidden'} bg-navy-blue text-white shadow-lg mt-2 rounded z-10 min-w-[180px]`}
              >
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block px-4 py-2 hover:bg-sky-blue" data-testid={item.testid}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li><Link href="/regattas" className="hover:text-sky-blue">Regattas</Link></li>
          <li><Link href="/gallery" className="hover:text-sky-blue">Gallery</Link></li>
          <li><Link href="/search" className="hover:text-sky-blue">Search</Link></li>
          <li><Link href="/about" className="hover:text-sky-blue">About</Link></li>
        </ul>
      </nav >
    </header >
  );
}
