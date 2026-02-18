import Link from "next/link";

const navLinks = [
  { href: "/compare", label: "Compare" },
  { href: "/reviews", label: "Reviews" },
  { href: "/best-tools", label: "Best Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-slate-900 hover:text-slate-700"
            >
              Digital CMO
            </Link>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              SaaS tool comparisons and reviews for Australian businesses. We help
              you choose the right software.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-500">
            This site contains affiliate links. We may earn a commission at no
            extra cost to you when you make a purchase through our links.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            © {new Date().getFullYear()} Digital CMO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
