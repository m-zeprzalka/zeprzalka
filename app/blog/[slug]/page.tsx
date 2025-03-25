// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import PortableText from "@/components/blog/PortableText";
import ClientSidebar from "@/components/blog/BlogSidebar";

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
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post || !post.published) {
      notFound();
    }

    // Obliczanie czasu czytania
    const readingTime = post.excerpt
      ? Math.ceil(post.excerpt.length / 1000) + 2
      : 3;

    // URL dla udostępniania
    const postUrl = `https://zeprzalka.pl/blog/${post.slug}`;

    return (
      <main className="blog-post">
        <div className="container">
          {/* Breadcrumbs navigation */}
          <div className="blog-post__breadcrumbs">
            <Link href="/" className="blog-post__breadcrumb-link">
              Strona główna
            </Link>
            <span className="blog-post__breadcrumb-separator">/</span>
            <Link href="/blog" className="blog-post__breadcrumb-link">
              Blog
            </Link>
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="blog-post__breadcrumb-separator">/</span>
                <Link
                  href={`/blog?category=${post.categories[0].slug}`}
                  className="blog-post__breadcrumb-link"
                >
                  {post.categories[0].name}
                </Link>
              </>
            )}
            <span className="blog-post__breadcrumb-separator">/</span>
            <span className="blog-post__breadcrumb-current">{post.title}</span>
          </div>

          <div className="blog-post__grid">
            {/* Main content column */}
            <article className="blog-post__content">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="blog-post__categories">
                  {post.categories.map((category, index) => (
                    <Link
                      key={category.id || index}
                      href={`/blog?category=${category.slug}`}
                      className="blog-post__category"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Post title */}
              <h1 className="blog-post__title">{post.title}</h1>

              {/* Meta info */}
              <div className="blog-post__meta">
                <time className="blog-post__date">
                  {formatDate(post.createdAt)}
                </time>
                <span className="blog-post__meta-separator">•</span>
                <span className="blog-post__reading-time">
                  {readingTime} min czytania
                </span>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div className="blog-post__cover">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={500}
                    priority
                    className="blog-post__cover-image"
                  />
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="blog-post__excerpt">
                  <p>{post.excerpt}</p>
                </div>
              )}

              {/* Main content */}
              <div className="blog-post__body">
                <PortableText content={post.content} />
              </div>

              {/* Author info (under the article) */}
              <div className="blog-post__author">
                <div className="blog-post__author-image">
                  <Image
                    src="/face-beta-min.webp"
                    alt="Michał Zeprzałka"
                    width={60}
                    height={60}
                    className="blog-post__author-avatar"
                  />
                </div>
                <div className="blog-post__author-info">
                  <h3 className="blog-post__author-name">Michał Zeprzałka</h3>
                  <p className="blog-post__author-bio">
                    Specjalista w dziedzinie AI, Programowania, UX/UI, Motion
                    Design
                  </p>
                </div>
              </div>
            </article>

            {/* Sticky sidebar - klient komponent */}
            <ClientSidebar post={post} url={postUrl} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Błąd podczas renderowania strony posta:", error);
    return (
      <div className="container">
        <div className="blog-post__error">
          <h1>Wystąpił błąd</h1>
          <p>Przepraszamy, nie udało się załadować artykułu.</p>
          <Link href="/blog" className="button button--primary">
            Wróć do bloga
          </Link>
        </div>
      </div>
    );
  }
}
