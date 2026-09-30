import Link from "next/link";
import { PostListItem } from "@/components/content/PostListItem";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: `${SITE_NAME} | Digital marketing strategy`,
  description: SITE_TAGLINE,
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="site-shell hero-copy">
          <p className="hero-brand">Digital CMO</p>
          <h1 className="hero-headline">
            Marketing leadership without the toolkit theatre.
          </h1>
          <p className="hero-lede">
            Daily strategy on channels, content systems, and measurement — written
            for global CMOs who need judgment, not another product roundup.
          </p>
          <div className="cta-row">
            <Link href="/blog" className="btn btn--primary">
              Read the blog
            </Link>
            <Link href="/about" className="btn btn--ghost">
              About the voice
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="site-shell">
          <p className="section-kicker">Latest</p>
          <h2 className="section-title">Recent briefs</h2>
          <p className="section-lede">
            New essays publish every day. Start with the latest strategic take.
          </p>
          {posts.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <PostListItem key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
