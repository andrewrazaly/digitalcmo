import { PostListItem } from "@/components/content/PostListItem";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Blog",
  description: SITE_DESCRIPTION,
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="site-shell">
      <header className="page-intro">
        <p className="section-kicker">Blog</p>
        <h1>Strategy, published daily</h1>
        <p>
          Essays on digital marketing systems, channel bets, content operations,
          and the measurement that keeps a CMO honest.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="empty-state">No posts published yet.</p>
      ) : (
        <div className="post-list" style={{ marginBottom: "4rem" }}>
          {posts.map((post) => (
            <PostListItem key={post.frontmatter.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
