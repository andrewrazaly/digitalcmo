import type { Metadata } from "next";
import type { PostFrontmatter } from "./types";
import { getSiteUrl, SITE_NAME, DEFAULT_AUTHOR } from "./site";

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildArticleMetadata(frontmatter: PostFrontmatter): Metadata {
  const path = `/blog/${frontmatter.slug}`;
  const base = buildPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path,
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt,
      authors: [frontmatter.author || DEFAULT_AUTHOR],
      tags: frontmatter.tags,
    },
  };
}

export function buildArticleJsonLd(frontmatter: PostFrontmatter) {
  const url = absoluteUrl(`/blog/${frontmatter.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    author: {
      "@type": "Organization",
      name: frontmatter.author || DEFAULT_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: frontmatter.tags.join(", "),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    description:
      "Daily digital marketing strategy from a Chief Marketing Officer perspective.",
    inLanguage: "en",
  };
}
