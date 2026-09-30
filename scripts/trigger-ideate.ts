/**
 * Local helper to hit the ideation cron route.
 *
 *   CRON_SECRET=devsecret npm run ideate:trigger
 *   CRON_SECRET=devsecret npm run ideate:trigger -- --force
 */
async function main() {
  const base = process.env.PUBLISH_BASE_URL || "http://localhost:3000";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("Set CRON_SECRET");
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  const url = new URL("/api/cron/ideate", base);
  if (force) url.searchParams.set("force", "1");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const text = await res.text();
  console.log(res.status, text);
  process.exit(res.ok ? 0 : 1);
}

main();
