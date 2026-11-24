const links = [
  { href: '/articles/', label: 'Articles' },
  { href: '/parts/', label: 'Parts' },
  { href: '/regattas/', label: 'Regattas' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
];
const socials = [
  { href: 'https://github.com/ryanbehan/v15-sailing', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="bg-panel border-t-2 border-signal mt-12">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div className="space-y-2 md:text-left text-center">
          <p className="font-black uppercase tracking-tight">
            V-15<span className="text-signal"> Sailing</span>
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-mono text-xs uppercase tracking-[0.2em] text-white/70 hover:text-signal transition">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex justify-center md:justify-end gap-4">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                className="font-mono text-xs uppercase tracking-[0.2em] text-white/70 hover:text-signal transition underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
