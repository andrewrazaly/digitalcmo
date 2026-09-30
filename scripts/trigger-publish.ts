/**
 * Local helper to hit the publish cron route.
 *
 *   CRON_SECRET=devsecret npm run publish:trigger
 *   CRON_SECRET=devsecret npm run publish:trigger -- --force --topic "content systems"
 */
async function main() {
  const base = process.env.PUBLISH_BASE_URL || "http://localhost:3000";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("Set CRON_SECRET");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const topicIdx = args.indexOf("--topic");
  const topic = topicIdx >= 0 ? args[topicIdx + 1] : undefined;

  const url = new URL("/api/cron/publish", base);
  if (force) url.searchParams.set("force", "1");
  if (topic) url.searchParams.set("topic", topic);

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
