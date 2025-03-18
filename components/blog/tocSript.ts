"use client";

// Skrypt do obsługi spisu treści (TOC)
// Umieść ten plik w katalogu components/blog/

import { useEffect } from "react";

export default function useTocHighlight() {
  useEffect(() => {
    // Dodajemy ID do wszystkich nagłówków h2, h3, h4 w treści artykułu
    const addHeadingIds = () => {
      const contentElement = document.querySelector(".blog-post__body");
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll("h2, h3, h4");

      headings.forEach((heading) => {
        const text = heading.textContent || "";
        const id = text
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");

        heading.setAttribute("id", id);
      });
    };

    // Funkcja do podświetlania aktywnego elementu w TOC
    const highlightActiveTocItem = () => {
      const tocLinks = document.querySelectorAll(".blog-post__toc-link");
      if (tocLinks.length === 0) return;

      // Pobierz wszystkie nagłówki z ID
      const headings = Array.from(
        document.querySelectorAll(
          ".blog-post__body h2[id], .blog-post__body h3[id], .blog-post__body h4[id]"
        )
      );
      if (headings.length === 0) return;

      // Ustal, który nagłówek jest aktualnie widoczny
      const scrollPosition = window.scrollY + 100; // offset

      let currentHeadingIndex = 0;

      // Znajdź aktualnie widoczny nagłówek
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;

        if (scrollPosition >= offsetTop) {
          currentHeadingIndex = i;
        }
      }

      // Usuń aktywną klasę ze wszystkich linków
      tocLinks.forEach((link) => {
        link.classList.remove("toc-active-link");
      });

      // Dodaj aktywną klasę do odpowiedniego linku
      if (currentHeadingIndex >= 0) {
        const currentHeading = headings[currentHeadingIndex];
        const currentId = currentHeading.getAttribute("id");

        const activeLink = document.querySelector(
          `.blog-post__toc-link[href="#${currentId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("toc-active-link");
        }
      }
    };

    // Obsługa mobilnego TOC
    const setupMobileToc = () => {
      const tocToggle = document.querySelector(
        ".blog-post__sidebar-toc-toggle"
      );
      const toc = document.querySelector(".blog-post__toc");

      if (tocToggle && toc) {
        tocToggle.addEventListener("click", () => {
          const tocRect = toc.getBoundingClientRect();
          window.scrollTo({
            top: tocRect.top + window.scrollY - 100,
            behavior: "smooth",
          });
        });
      }
    };

    // Uruchom wszystkie funkcje
    addHeadingIds();
    highlightActiveTocItem();
    setupMobileToc();

    // Nasłuchuj przewijania strony
    window.addEventListener("scroll", highlightActiveTocItem);

    // Oczyść nasłuchiwanie przy odmontowaniu komponentu
    return () => {
      window.removeEventListener("scroll", highlightActiveTocItem);
    };
  }, []);
}

// Komponent do łatwego używania w innych komponentach
export function TocScript() {
  useTocHighlight();
  return null;
}
