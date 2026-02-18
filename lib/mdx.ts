import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ComparisonTable } from "@/components/content/ComparisonTable";
import { AffiliateButton } from "@/components/content/AffiliateButton";
import { ProsConsList } from "@/components/content/ProsConsList";

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};

export const mdxComponents = {
  ComparisonTable,
  AffiliateButton,
  ProsConsList,
};
