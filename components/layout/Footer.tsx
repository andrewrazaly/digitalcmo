import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div className="footer-brand">
          <span className="footer-brand__name">Digital CMO</span>
          <p className="footer-brand__copy">
            Daily strategy for marketers who own the outcome — not the toolkit.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </div>
        <p className="footer-meta">
          © {new Date().getFullYear()} Digital CMO. Auto-published daily for a
          global audience.
        </p>
      </div>
    </footer>
  );
}
