import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-navy-blue text-white">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/images/v15-logo.svg" alt="Vanguard 15 logo" className="w-8 h-8" />
          <span>V-15 Sailing</span>
        </Link>
        <button
          type="button"
          className="sm:hidden focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <ul className={`sm:flex space-x-4 ${open ? 'block' : 'hidden'} sm:block mt-4 sm:mt-0`}>
          <li><Link href="/articles/clubs" className="hover:text-sky-blue">Clubs</Link></li>
          <li className="relative">
            <span
              className="hover:text-sky-blue cursor-pointer"
              data-testid="nav-guides"
              onClick={() => setOpen(open === 'guides' ? false : 'guides')}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
              aria-haspopup="true"
              aria-expanded={open === 'guides'}
            >Guides</span>
            <ul
              className={`absolute left-0 ${open === 'guides' ? 'block' : 'hidden'} bg-navy-blue text-white shadow-lg mt-2 rounded z-10 min-w-[180px]`}
            >
              <li><Link href="/guides/fleet-development" className="block px-4 py-2 hover:bg-sky-blue">Fleet Development</Link></li>
              <li><Link href="/guides/maintenance" className="block px-4 py-2 hover:bg-sky-blue">Maintenance</Link></li>
              <li><Link href="/guides/racing" className="block px-4 py-2 hover:bg-sky-blue">Racing</Link></li>
              <li><Link href="/guides/rigging" className="block px-4 py-2 hover:bg-sky-blue">Rigging</Link></li>
              <li><Link href="/guides/tuning" className="block px-4 py-2 hover:bg-sky-blue">Tuning</Link></li>
              <li><Link href="/guides" className="block px-4 py-2 hover:bg-sky-blue">All Guides</Link></li>
            </ul>
          </li>
          <li
            className="relative"
          >
            <span
              className="hover:text-sky-blue cursor-pointer"
              data-testid="nav-articles"
              onClick={() => setOpen(open === 'articles' ? false : 'articles')}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
              aria-haspopup="true"
              aria-expanded={open === 'articles'}
            >Articles</span>
            <ul
              className={`absolute left-0 ${open === 'articles' ? 'block' : 'hidden'} bg-navy-blue text-white shadow-lg mt-2 rounded z-10 min-w-[180px]`}
              tabIndex={-1}
            >
              <li><Link href="/articles/contacts" className="block px-4 py-2 hover:bg-sky-blue" data-testid="nav-articles-contacts">Contacts</Link></li>
              <li><Link href="/articles/rules" className="block px-4 py-2 hover:bg-sky-blue">Class Rules</Link></li>
              <li><Link href="/articles" className="block px-4 py-2 hover:bg-sky-blue">All Articles</Link></li>
            </ul>
          </li>
          <li className="relative">
            <span
              className="hover:text-sky-blue cursor-pointer"
              data-testid="nav-parts"
              onClick={() => setOpen(open === 'parts' ? false : 'parts')}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
              aria-haspopup="true"
              aria-expanded={open === 'parts'}
            >Parts</span>
            <ul
              className={`absolute left-0 ${open === 'parts' ? 'block' : 'hidden'} bg-navy-blue text-white shadow-lg mt-2 rounded z-10 min-w-[180px]`}
            >
              <li><Link href="/parts/hull-hardware" className="block px-4 py-2 hover:bg-sky-blue">Hull Hardware</Link></li>
              <li><Link href="/parts/spars" className="block px-4 py-2 hover:bg-sky-blue">Spars</Link></li>
              <li><Link href="/parts/running-rigging" className="block px-4 py-2 hover:bg-sky-blue">Running Rigging</Link></li>
              <li><Link href="/parts/sails" className="block px-4 py-2 hover:bg-sky-blue">Sails</Link></li>
              <li><Link href="/parts" className="block px-4 py-2 hover:bg-sky-blue">Parts Finder</Link></li>
            </ul>
          </li>
          <li><Link href="/regattas" className="hover:text-sky-blue">Regattas</Link></li>
          <li><Link href="/about" className="hover:text-sky-blue">About</Link></li>
        </ul>
      </nav >
    </header >
  );
}
