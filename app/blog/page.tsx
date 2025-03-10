import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import Pagination from "@/components/ui/Pagination";
import { getPaginatedPosts, getCategories } from "@/lib/blog";
import { generateSeoMetadata } from "@/lib/utils";
import { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string; page?: string; q?: string };
}): Promise<Metadata> {
  const { category, q } = searchParams;

  let title = "Blog - Michał Zeprzałka";
  let description =
    "Artykuły, przemyślenia i porady dotyczące marketingu, AI i rozwoju osobistego.";

  if (category) {
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
    title = `${formattedCategory} - Blog Michała Zeprzałki`;
    description = `Artykuły z kategorii ${formattedCategory}. Praktyczne porady, wskazówki i przemyślenia.`;
  }

  if (q) {
    title = `Wyniki wyszukiwania: ${q} - Blog Michała Zeprzałki`;
    description = `Artykuły zawierające frazę "${q}". Znajdź interesujące Cię treści na blogu.`;
  }

  return generateSeoMetadata(title, description);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string; q?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { category, q } = searchParams;

  if (page < 1) notFound();

  try {
    const [categoriesData, postsData] = await Promise.all([
      getCategories(),
      getPaginatedPosts({
        page,
        categorySlug: category,
        searchQuery: q,
      }),
    ]);

    const { posts, total, totalPages } = postsData;
    const activeCategory = category || "all";

    let pageTitle = "Blog";

    if (category) {
      const categoryObj = categoriesData.find((cat) => cat.slug === category);
      if (categoryObj) {
        pageTitle += ` - ${categoryObj.name}`;
      }
    }

    if (q) {
      pageTitle += ` - Wyniki wyszukiwania: ${q}`;
    }

    return (
      <main className="blog-page">
        <div className="blog-page__container">
          <header className="blog-page__header">
            <h1 className="blog-page__title">{pageTitle}</h1>
            <p className="blog-page__description">
              Dzielę się tutaj wiedzą, doświadczeniami i przemyśleniami na
              tematy związane z marketingiem, nowymi technologiami i rozwojem
              biznesu.
            </p>
          </header>

          <div className="blog-page__filters">
            <div className="blog-page__filter-group">
              <Link
                href="/blog"
                className={`button ${
                  activeCategory === "all"
                    ? "button--secondary"
                    : "button--outline"
                } button--sm`}
              >
                Wszystkie
              </Link>

              {categoriesData.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`button ${
                    activeCategory === cat.slug
                      ? "button--secondary"
                      : "button--outline"
                  } button--sm`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="blog-page__search">
              <form action="/blog" method="GET">
                {category && (
                  <input type="hidden" name="category" value={category} />
                )}
                <input
                  type="text"
                  name="q"
                  placeholder="Szukaj..."
                  defaultValue={q || ""}
                  className="blog-page__input"
                  style={{ maxWidth: "250px" }}
                />
                <button type="submit" className="blog-page__search-button">
                  <span className="sr-only">Szukaj</span>
                </button>
              </form>
            </div>
          </div>

          {total === 0 ? (
            <div className="blog-page__no-results">
              <p>Nie znaleziono wpisów spełniających podane kryteria.</p>
              <Link href="/blog" className="button button--primary button--sm">
                Pokaż wszystkie wpisy
              </Link>
            </div>
          ) : (
            <>
              <BlogList posts={posts} />

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/blog${category ? `?category=${category}` : ""}${
                    q ? `${category ? "&" : "?"}q=${q}` : ""
                  }`}
                />
              )}
            </>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Błąd podczas ładowania strony bloga:", error);
    return (
      <div className="error-page container">
        <h1>Wystąpił błąd</h1>
        <p>Przepraszamy, nie udało się załadować bloga.</p>
        <Link href="/" className="button button--primary">
          Wróć na stronę główną
        </Link>
      </div>
    );
  }
}
