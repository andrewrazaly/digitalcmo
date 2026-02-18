import type { Metadata } from "next";
import type { ArticleFrontmatter } from "./types";

const SITE_URL = "https://digitalcmo.com.au";

export function generateArticleMetadata(
  frontmatter: ArticleFrontmatter,
  type: string
): Metadata {
  const path = type === "best-tools" ? `best-tools/${frontmatter.slug}` : `${type}/${frontmatter.slug}`;
  const canonical = `${SITE_URL}/${path}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      url: canonical,
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt,
    },
  };
}

export function generateArticleJsonLd(
  frontmatter: ArticleFrontmatter,
  type: string
): object {
  const path = type === "best-tools" ? `best-tools/${frontmatter.slug}` : `${type}/${frontmatter.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    author: {
      "@type": "Organization",
      name: frontmatter.author,
    },
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    url: `${SITE_URL}/${path}`,
  };
}

export function generateReviewJsonLd(
  frontmatter: ArticleFrontmatter,
  tool: { name: string; slug: string }
): object {
  const path = `reviews/${frontmatter.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: tool.name,
    },
    author: {
      "@type": "Organization",
      name: frontmatter.author,
    },
    datePublished: frontmatter.publishedAt,
    reviewBody: frontmatter.description,
    url: `${SITE_URL}/${path}`,
  };
}

export function generateFaqJsonLd(questions: { q: string; a: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
