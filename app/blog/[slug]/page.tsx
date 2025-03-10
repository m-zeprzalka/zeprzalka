// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import PortableText from "@/components/blog/PortableText";

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

// Zmieniona definicja funkcji - uproszczone typowanie
export default async function BlogPostPage({ params }: any) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post || !post.published) {
      notFound();
    }

    // Obliczanie czasu czytania
    const readingTime = post.excerpt
      ? Math.ceil(post.excerpt.length / 1000) + 2
      : 3;

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

              {/* Tags */}
              {post.categories && post.categories.length > 0 && (
                <div className="blog-post__tags">
                  <h3 className="blog-post__tags-title">Tagi:</h3>
                  <div className="blog-post__tags-list">
                    {post.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className="blog-post__tag"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author info (under the article) */}
              <div className="blog-post__author">
                <div className="blog-post__author-image">
                  <Image
                    src="/images/avatar.jpg"
                    alt="Michał Zeprzałka"
                    width={60}
                    height={60}
                    className="blog-post__author-avatar"
                  />
                </div>
                <div className="blog-post__author-info">
                  <h3 className="blog-post__author-name">Michał Zeprzałka</h3>
                  <p className="blog-post__author-bio">
                    Ekspert w dziedzinie marketingu i pozycjonowania. Pomagam
                    firmom zwiększać widoczność online.
                  </p>
                </div>
              </div>
            </article>

            {/* Sticky sidebar */}
            <aside className="blog-post__sidebar">
              <div className="blog-post__sidebar-sticky">
                {/* Share section - będzie sticky */}
                <div className="blog-post__share">
                  <h3 className="blog-post__share-title">Udostępnij:</h3>
                  <div className="blog-post__share-buttons">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://zeprzalka.pl/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-post__share-button blog-post__share-button--facebook"
                      aria-label="Udostępnij na Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://zeprzalka.pl/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-post__share-button blog-post__share-button--twitter"
                      aria-label="Udostępnij na Twitter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://zeprzalka.pl/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-post__share-button blog-post__share-button--linkedin"
                      aria-label="Udostępnij na LinkedIn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Recent posts section */}
                <div className="blog-post__sidebar-section">
                  <h3 className="blog-post__sidebar-title">
                    Ostatnie artykuły
                  </h3>
                  <ul className="blog-post__recent-posts">
                    <li className="blog-post__recent-post">
                      <Link
                        href="/blog/marketing-w-social-mediach-przewodnik"
                        className="blog-post__recent-post-link"
                      >
                        <div className="blog-post__recent-post-content">
                          <span className="blog-post__recent-post-title">
                            Marketing w social mediach - przewodnik
                          </span>
                          <span className="blog-post__recent-post-date">
                            12 Lip 2023
                          </span>
                        </div>
                      </Link>
                    </li>
                    <li className="blog-post__recent-post">
                      <Link
                        href="/blog/jak-pozycjonowac-strone-w-2023-roku"
                        className="blog-post__recent-post-link"
                      >
                        <div className="blog-post__recent-post-content">
                          <span className="blog-post__recent-post-title">
                            Jak pozycjonować stronę w 2023 roku
                          </span>
                          <span className="blog-post__recent-post-date">
                            5 Cze 2023
                          </span>
                        </div>
                      </Link>
                    </li>
                    <li className="blog-post__recent-post">
                      <Link
                        href="/blog/narzedzia-ai-ktore-zmienia-twoj-biznes"
                        className="blog-post__recent-post-link"
                      >
                        <div className="blog-post__recent-post-content">
                          <span className="blog-post__recent-post-title">
                            Narzędzia AI, które zmienią Twój biznes
                          </span>
                          <span className="blog-post__recent-post-date">
                            21 Maj 2023
                          </span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Ad section */}
                <div className="blog-post__sidebar-section">
                  <div className="blog-post__ad">
                    <span className="blog-post__ad-label">Reklama</span>
                    <div className="blog-post__ad-content">
                      <h4 className="blog-post__ad-title">
                        Potrzebujesz strony internetowej?
                      </h4>
                      <p className="blog-post__ad-text">
                        Profesjonalne strony dla firm i osób prywatnych. Szybko,
                        nowocześnie, responsywnie.
                      </p>
                      <Link
                        href="/kontakt"
                        className="button button--outline button--sm blog-post__ad-button"
                      >
                        Dowiedz się więcej
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
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
