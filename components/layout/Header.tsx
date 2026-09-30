import Link from "next/link";

const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-mark" aria-label="Digital CMO home">
          <span className="brand-mark__signal" aria-hidden="true" />
          <span className="brand-mark__name">Digital CMO</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
