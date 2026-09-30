import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Health/status endpoint for the auto-blogging queue.
 * Protected by CRON_SECRET when set (Vercel Cron / external schedulers).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const queuePath = path.join(process.cwd(), "data", "content-queue.json");
  let queueLength = 0;
  if (fs.existsSync(queuePath)) {
    try {
      const queue = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
      queueLength = Array.isArray(queue) ? queue.length : 0;
    } catch {
      queueLength = -1;
    }
  }

  return NextResponse.json({
    ok: true,
    site: "Digital CMO",
    focus: "digital-marketing",
    queueLength,
    monetization: {
      affiliatesConfigured: fs.existsSync(
        path.join(process.cwd(), "data", "affiliates.json")
      ),
    },
    hint: "Run `npm run publish -- --count 1` (with ANTHROPIC_API_KEY) or the GitHub Action to generate articles.",
  });
}
