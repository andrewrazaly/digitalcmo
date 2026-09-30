#!/usr/bin/env npx tsx
/**
 * Publish pipeline for auto-blogging:
 * 1) generate N articles from the queue
 * 2) optionally commit + push so Vercel redeploys
 *
 * Usage:
 *   npm run publish -- --count 1
 *   npm run publish -- --count 3 --no-git
 */
import { execSync } from "child_process";
import path from "path";

const scriptPath = path.join(__dirname, "generate-article.ts");

function runGenerate() {
  try {
    execSync(`npx tsx ${scriptPath}`, {
      stdio: "inherit",
      env: process.env,
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const countIdx = args.indexOf("--count");
  const count = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) || 1 : 1;
  const noGit = args.includes("--no-git");

  for (let i = 0; i < count; i++) {
    console.log(`\n--- Publish ${i + 1}/${count} ---`);
    const ok = runGenerate();
    if (!ok) {
      console.error("Generation failed");
      process.exit(1);
    }
  }

  if (noGit) {
    console.log("\nSkipped git commit/push (--no-git).");
    return;
  }

  console.log("\n--- Git commit & push ---");
  try {
    execSync("git add content data/content-queue.json", { stdio: "inherit" });
    const status = execSync("git status --porcelain", { encoding: "utf-8" });
    if (!status.trim()) {
      console.log("Nothing to commit.");
      return;
    }
    execSync(
      'git commit -m "content: publish generated digital marketing articles"',
      { stdio: "inherit" }
    );
    execSync("git push", { stdio: "inherit" });
    console.log("Pushed. Vercel will auto-deploy.");
  } catch (e) {
    console.warn("Git push failed (maybe nothing to commit):", e);
  }
}

main();
