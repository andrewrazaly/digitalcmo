/**
 * Deterministic QA gate checks for Phase 1.
 * Usage: npx tsx scripts/test-qa.ts
 */
import fs from "fs";
import path from "path";
import { parseMdxFixture, runQualityGates } from "../lib/publish/qa";

function load(name: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "content", "fixtures", name),
    "utf8"
  );
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const pass = parseMdxFixture(load("qa-pass.mdx"));
const passResult = runQualityGates(pass, { existingSlugs: [] });
assert(passResult.ok, `Expected qa-pass to succeed: ${JSON.stringify(passResult.issues)}`);

const fail = parseMdxFixture(load("qa-fail.mdx"));
const failResult = runQualityGates(fail, { existingSlugs: [] });
assert(!failResult.ok, "Expected qa-fail to fail");
assert(
  failResult.issues.some((i) => i.code === "banlist"),
  "Expected banlist hit"
);
assert(
  failResult.issues.some((i) => i.code === "slug_invalid" || i.code === "author_invalid"),
  "Expected slug/author failures"
);

console.log(
  JSON.stringify(
    {
      ok: true,
      passIssues: passResult.issues.length,
      failIssueCodes: failResult.issues.map((i) => i.code),
    },
    null,
    2
  )
);
