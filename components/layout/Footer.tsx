import Link from "next/link";

const navLinks = [
  { href: "/topics", label: "Topics" },
  { href: "/compare", label: "Compare" },
  { href: "/reviews", label: "Reviews" },
  { href: "/best-tools", label: "Best Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="font-display text-2xl font-bold tracking-tight">
              Digital CMO
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              An auto-publishing digital marketing site built to earn search
              traffic and monetise through honest tool recommendations.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-xs text-white/50">
            Affiliate disclosure: we may earn a commission when you buy through
            our links—at no extra cost to you. Recommendations stay independent.
          </p>
          <p className="mt-2 text-xs text-white/40">
            © {new Date().getFullYear()} Digital CMO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
