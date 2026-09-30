export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: "Digital CMO" | string;
};

export type Post = {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
};
