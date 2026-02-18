import path from "path";
import fs from "fs";

let affiliatesCache: Record<string, string> | null = null;
let toolsCache: { slug: string; website: string }[] | null = null;

function loadAffiliates(): Record<string, string> {
  if (affiliatesCache) return affiliatesCache;
  const filePath = path.join(process.cwd(), "data", "affiliates.json");
  if (!fs.existsSync(filePath)) {
    affiliatesCache = {};
    return {};
  }
  affiliatesCache = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, string>;
  return affiliatesCache;
}

function loadTools(): { slug: string; website: string }[] {
  if (toolsCache) return toolsCache;
  const filePath = path.join(process.cwd(), "data", "tools.json");
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const arr = Array.isArray(data) ? data : [];
  toolsCache = arr.map((t: { slug?: string; website?: string }) => ({
    slug: t.slug || "",
    website: t.website || "",
  })).filter((t) => t.slug && t.website);
  return toolsCache;
}

export function getAffiliateLink(toolSlug: string): string | null {
  const affiliates = loadAffiliates();
  return affiliates[toolSlug] || null;
}

/** Returns affiliate URL if available, otherwise direct tool website. */
export function getToolUrl(toolSlug: string): string {
  const affiliate = getAffiliateLink(toolSlug);
  if (affiliate) return affiliate;
  const tools = loadTools();
  const tool = tools.find((t) => t.slug === toolSlug);
  if (tool?.website) {
    const url = tool.website.startsWith("http") ? tool.website : `https://${tool.website}`;
    return url;
  }
  return `https://${toolSlug}.com`;
}
