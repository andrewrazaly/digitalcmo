import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

const SITE_URL = "https://digitalcmo.com.au";

const typeToPath: Record<string, string> = {
  review: "reviews",
  comparison: "compare",
  roundup: "best-tools",
  guide: "guides",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const articleUrls = articles.map((a) => {
    const base = typeToPath[a.type] || "reviews";
    const path = base === "best-tools" ? `best-tools/${a.slug}` : `${base}/${a.slug}`;
    return {
      url: `${SITE_URL}/${path}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/best-tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  return [...staticPages, ...articleUrls];
}
