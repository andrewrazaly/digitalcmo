import fs from "fs";
import path from "path";

const BRIEF_PATH = path.join(process.cwd(), "content", "brand-brief.md");

export function loadBrandBrief(): string {
  if (!fs.existsSync(BRIEF_PATH)) {
    throw new Error(`Brand brief missing at ${BRIEF_PATH}`);
  }
  return fs.readFileSync(BRIEF_PATH, "utf8");
}
