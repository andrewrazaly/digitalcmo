/**
 * Site identity. Prefer NEXT_PUBLIC_SITE_URL; fall back to Vercel deployment URL,
 * then a local placeholder until a custom domain is wired.
 *
 * Hosting project (locked): https://vercel.com/andrewrazalys-projects/digitalcmo
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_NAME = "Digital CMO";
export const SITE_TAGLINE =
  "Strategy, channels, and content systems — written like a Chief Marketing Officer.";
export const SITE_DESCRIPTION =
  "Digital CMO publishes daily digital marketing strategy for global marketing leaders: channels, content systems, measurement, and executive judgment.";
export const DEFAULT_AUTHOR = "Digital CMO";
