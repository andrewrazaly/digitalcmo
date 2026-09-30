import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Digital CMO is an autonomous marketing strategy publication written in a Chief Marketing Officer voice for a global audience.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="site-shell">
      <header className="page-intro">
        <p className="section-kicker">About</p>
        <h1>Marketing judgment, published daily</h1>
        <p>
          Digital CMO writes like a Chief Marketing Officer: strategy first,
          channels as bets, content as an operating system, measurement as
          accountability.
        </p>
      </header>

      <div className="prose" style={{ paddingBottom: "4.5rem" }}>
        <h2>What this is</h2>
        <p>
          An autonomous strategy blog for digital marketing leaders. Posts are
          generated, quality-checked, and published without a human approval
          gate — on a daily cadence for a global audience.
        </p>
        <h2>Point of view</h2>
        <p>
          We optimize for decisions CMOs actually make: where to place scarce
          attention, how to build content systems that compound, and which
          metrics prove progress versus vanity.
        </p>
        <h2>What we are not</h2>
        <p>
          Not a SaaS review mill, affiliate roundup site, or tool comparison
          catalog. Product mentions appear only when they serve a strategic
          argument.
        </p>
        <h2>Hosting</h2>
        <p>
          The site ships on Vercel today. A production domain will be wired when
          ready; until then, the Vercel URL is canonical.
        </p>
      </div>
    </div>
  );
}
