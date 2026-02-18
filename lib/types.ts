export type ArticleType = "review" | "comparison" | "roundup" | "guide";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  slug: string;
  type: ArticleType;
  category: string;
  tags: string[];
  tools?: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  draft: boolean;
}

export interface ArticleContent {
  frontmatter: ArticleFrontmatter;
  content: string;
  headings: Heading[];
  readingTime: number;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface ToolData {
  slug: string;
  name: string;
  website: string;
  pricing?: string;
  category: string;
}
