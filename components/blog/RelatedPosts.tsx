import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/blog";

type RelatedPostsProps = {
  posts: Post[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="blog-post__related">
      <h3 className="blog-post__related-title">Powiązane artykuły</h3>

      <div className="blog-post__related-posts">
        {posts.map((post) => (
          <div key={post.id} className="blog-post__related-post">
            <Link
              href={`/blog/${post.slug}`}
              className="blog-post__related-link"
            >
              <div className="blog-post__related-image-container">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    className="blog-post__related-image"
                  />
                ) : (
                  <div className="blog-post__related-image-placeholder">
                    <span>MZ</span>
                  </div>
                )}
              </div>

              <div className="blog-post__related-content">
                <h4 className="blog-post__related-post-title">{post.title}</h4>

                <div className="blog-post__related-meta">
                  <time className="blog-post__related-date">
                    {formatDate(post.createdAt)}
                  </time>

                  {post.categories.length > 0 && (
                    <span className="blog-post__related-category">
                      {post.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
