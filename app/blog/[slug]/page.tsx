import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { formatDate, getReadingTime } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post nie znaleziony",
      description: "Nie znaleziono postu o podanym adresie.",
    };
  }

  return {
    title: `${post.title} - Blog Michała Zeprzałki`,
    description:
      post.excerpt ||
      `Przeczytaj artykuł "${post.title}" na blogu Michała Zeprzałki.`,
    openGraph: {
      title: post.title,
      description:
        post.excerpt ||
        `Przeczytaj artykuł "${post.title}" na blogu Michała Zeprzałki.`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name || "Michał Zeprzałka"],
      images: post.coverImage
        ? [{ url: post.coverImage }]
        : [{ url: "/images/og-image.jpg" }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  // Pobieranie powiązanych postów
  const relatedPosts = await getRelatedPosts(post.id);

  // Obliczenie czasu czytania
  const readingTime = post.content ? getReadingTime(post.content) : 1;

  return (
    <main className="single-post">
      <div className="container">
        <article className="post">
          <header className="post__header">
            <div className="post__meta">
              <div className="post__categories">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className="post__category"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <time className="post__date">{formatDate(post.createdAt)}</time>

              <span className="post__reading-time">
                {readingTime} min czytania
              </span>
            </div>

            <h1 className="post__title">{post.title}</h1>

            <div className="post__author">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Autor"}
                  width={40}
                  height={40}
                  className="post__author-image"
                />
              ) : (
                <div className="post__author-placeholder">
                  {post.author.name?.[0] || "M"}
                </div>
              )}
              <span className="post__author-name">
                {post.author.name || "Michał Zeprzałka"}
              </span>
            </div>
          </header>

          {post.coverImage && (
            <div className="post__cover-image-container">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                priority
                className="post__cover-image"
              />
            </div>
          )}

          {post.excerpt && (
            <div className="post__excerpt">
              <p>{post.excerpt}</p>
            </div>
          )}

          <div className="post__content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeHighlight]}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>

          <div className="post__footer">
            <div className="post__share">
              <h3 className="post__share-title">Udostępnij artykuł</h3>
              <div className="post__share-buttons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `https://zeprzalka.pl/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post__share-button post__share-button--facebook"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://zeprzalka.pl/blog/${post.slug}`
                  )}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post__share-button post__share-button--twitter"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `https://zeprzalka.pl/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post__share-button post__share-button--linkedin"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="post__author-bio">
              <div className="post__author-bio-avatar">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Autor"}
                    width={80}
                    height={80}
                    className="post__author-bio-image"
                  />
                ) : (
                  <div className="post__author-bio-placeholder">
                    {post.author.name?.[0] || "M"}
                  </div>
                )}
              </div>
              <div className="post__author-bio-content">
                <h3 className="post__author-bio-name">
                  {post.author.name || "Michał Zeprzałka"}
                </h3>
                <p className="post__author-bio-text">
                  Specjalista z wieloletnim doświadczeniem w dziedzinie
                  marketingu cyfrowego, AI i technologii webowych. Dzielę się
                  wiedzą i pomagam rozwijać biznesy z wykorzystaniem
                  nowoczesnych narzędzi.
                </p>
              </div>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <aside className="related-posts">
            <h2 className="related-posts__title">Powiązane artykuły</h2>
            <div className="related-posts__grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="related-posts__item">
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="related-posts__link"
                  >
                    <div className="related-posts__image-container">
                      {relatedPost.coverImage ? (
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                          className="related-posts__image"
                        />
                      ) : (
                        <div className="related-posts__image-placeholder">
                          <span>MZ</span>
                        </div>
                      )}
                    </div>
                    <h3 className="related-posts__item-title">
                      {relatedPost.title}
                    </h3>
                    <div className="related-posts__meta">
                      <time className="related-posts__date">
                        {formatDate(relatedPost.createdAt)}
                      </time>
                      {relatedPost.categories.length > 0 && (
                        <span className="related-posts__category">
                          {relatedPost.categories[0].name}
                        </span>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
