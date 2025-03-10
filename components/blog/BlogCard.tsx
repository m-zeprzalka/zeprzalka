// components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Post } from "@/lib/types"; // Zmiana na poprawny import

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  console.log(
    "Renderowanie BlogCard dla posta:",
    post.title,
    "slug:",
    post.slug
  );

  // Zabezpieczenie przed undefined slug
  if (!post.slug) {
    console.error("UWAGA: Post bez sluga!", post);
    return null; // Nie renderuj postów bez sluga
  }

  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <div className="blog-card__image-container">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="blog-card__image"
            />
          ) : (
            <div className="blog-card__image-placeholder">
              <span>MZ</span>
            </div>
          )}
        </div>

        <div className="blog-card__content">
          <h3 className="blog-card__title">{post.title}</h3>

          {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}

          <div className="blog-card__meta">
            <time className="blog-card__date">
              {formatDate(new Date(post.createdAt))}
            </time>

            {post.categories && post.categories.length > 0 && (
              <div className="blog-card__categories">
                {post.categories.map((category) => (
                  <span
                    key={category.id || category.slug}
                    className="blog-card__category"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
