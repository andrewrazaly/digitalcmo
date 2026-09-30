import { timingSafeEqual } from "crypto";

/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
 * Manual triggers may use the same header or `x-cron-secret`.
 */
export function assertCronAuthorized(request: Request): void {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    throw new AuthError("CRON_SECRET is not configured");
  }

  const header =
    request.headers.get("authorization") ||
    request.headers.get("x-cron-secret") ||
    "";

  let provided = header;
  if (header.toLowerCase().startsWith("bearer ")) {
    provided = header.slice(7).trim();
  }

  if (!provided || !safeEqual(provided, secret)) {
    throw new AuthError("Unauthorized");
  }
}

export class AuthError extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}
