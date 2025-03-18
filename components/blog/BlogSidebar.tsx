"use client";

// components/blog/BlogSidebar.tsx
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type BlogSidebarProps = {
  post: Post;
  relatedPosts?: Post[]; // Dodajemy powiązane posty z props
};

export default function BlogSidebar({
  post,
  relatedPosts = [],
}: BlogSidebarProps) {
  // Wybieramy 3 ostatnie posty różne od bieżącego
  const recentPosts = relatedPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <aside className="blog-post__sidebar">
      <div className="blog-post__sidebar-sticky">
        {/* Author info - teraz na górze */}
        <div className="blog-post__sidebar-section blog-post__sidebar-author-section">
          <div className="blog-post__sidebar-author">
            <div className="blog-post__sidebar-author-image">
              <Image
                src="/face-beta-min.webp"
                alt="Michał Zeprzałka"
                width={60}
                height={60}
                className="blog-post__sidebar-author-avatar"
              />
            </div>
            <div className="blog-post__sidebar-author-info">
              <h3 className="blog-post__sidebar-author-name">
                Michał Zeprzałka
              </h3>
              <p className="blog-post__sidebar-author-bio">
                Ekspert w dziedzinie marketingu i pozycjonowania. Pomagam firmom
                zwiększać widoczność online.
              </p>
            </div>
          </div>

          <div className="blog-post__sidebar-social">
            <a
              href="https://twitter.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-post__sidebar-social-link blog-post__sidebar-social-link--twitter"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/example"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-post__sidebar-social-link blog-post__sidebar-social-link--linkedin"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://facebook.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-post__sidebar-social-link blog-post__sidebar-social-link--facebook"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href={`mailto:kontakt@zeprzalka.pl`}
              className="blog-post__sidebar-social-link blog-post__sidebar-social-link--mail"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* Ostatnie artykuły - wersja bardzo prosta */}
        <div className="blog-post__sidebar-section">
          <h3 className="blog-post__sidebar-title">Ostatnie artykuły</h3>
          <ul className="blog-post__recent-posts-list">
            {recentPosts.map((post) => (
              <li key={post.id} className="blog-post__recent-posts-item">
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-post__recent-posts-link"
                >
                  {post.title}
                </Link>
              </li>
            ))}
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
                className="button button--primary button--sm blog-post__ad-button"
              >
                Dowiedz się więcej
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
