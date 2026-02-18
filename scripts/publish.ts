#!/usr/bin/env npx tsx
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
  const count = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 1;

  for (let i = 0; i < count; i++) {
    console.log(`\n--- Publish ${i + 1}/${count} ---`);
    const ok = runGenerate();
    if (!ok) {
      console.error("Generation failed");
      process.exit(1);
    }
  }

  console.log("\n--- Git commit & push ---");
  try {
    execSync("git add -A && git status", { stdio: "inherit" });
    execSync('git commit -m "Add generated articles"', { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("Pushed. Vercel will auto-deploy.");
  } catch (e) {
    console.warn("Git push failed (maybe nothing to commit):", e);
  }
}

main();
