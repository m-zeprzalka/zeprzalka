import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Funkcja pomocnicza do budowania ścieżek
  const getPageUrl = (page: number) => {
    // Jeśli ścieżka zawiera już parametry, dodaj parametr strony z '&'
    if (basePath.includes("?")) {
      return `${basePath}&page=${page}`;
    }
    // W przeciwnym razie dodaj z '?'
    return `${basePath}?page=${page}`;
  };

  // Funkcja tworząca przyciski stronicowania
  const createPageLinks = () => {
    // Ustalenie, ile stron pokazać
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Upewnij się, że zawsze pokazujesz maxVisiblePages stron, jeśli to możliwe
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // Zawsze dodaj pierwszą stronę
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className={`button ${
            currentPage === 1 ? "button--primary" : "button--outline"
          } button--sm`}
        >
          1
        </Link>
      );

      // Dodaj wielokropek, jeśli zaczynamy od strony > 2
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="pagination__ellipsis">
            &hellip;
          </span>
        );
      }
    }

    // Dodaj strony pośrodku
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`button ${
            currentPage === i ? "button--primary" : "button--outline"
          } button--sm`}
        >
          {i}
        </Link>
      );
    }

    // Dodaj wielokropek i ostatnią stronę, jeśli to potrzebne
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="pagination__ellipsis">
            &hellip;
          </span>
        );
      }

      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className={`button ${
            currentPage === totalPages ? "button--primary" : "button--outline"
          } button--sm`}
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div className="blog-page__pagination">
      <div className="blog-page__filter-group">
        {/* Przycisk Poprzednia */}
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="button button--outline button--sm"
          >
            ← Poprzednia
          </Link>
        )}

        {/* Przyciski ze stronami */}
        {createPageLinks()}

        {/* Przycisk Następna */}
        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="button button--outline button--sm"
          >
            Następna →
          </Link>
        )}
      </div>
    </div>
  );
}
