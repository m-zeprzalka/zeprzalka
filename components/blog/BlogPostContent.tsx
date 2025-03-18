// components/blog/BlogPostContent.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { calculateReadingTime } from "@/lib/sanity";
import { Post } from "@/lib/types";
import PortableText from "./PortableText";
import ShareButtonsClient from "./ShareButtonsClient";
import AuthorCard from "./AuthorCard";
import RelatedPosts from "./RelatedPosts";

type BlogPostContentProps = {
  post: Post;
  relatedPosts?: Post[];
  url: string;
};

export default function BlogPostContent({
  post,
  relatedPosts = [],
  url,
}: BlogPostContentProps) {
  const [readingTime, setReadingTime] = useState<number>(3);

  // Oblicz czas czytania na podstawie treści
  useEffect(() => {
    if (post.content && Array.isArray(post.content)) {
      const estimatedTime = calculateReadingTime(post.content);
      setReadingTime(estimatedTime);
    } else if (post.excerpt) {
      // Oblicz z excerpta jeśli nie ma content
      setReadingTime(Math.ceil(post.excerpt.length / 1000) + 2);
    }
  }, [post.content, post.excerpt]);

  // Przetwórz datę
  const formattedDate =
    typeof post.createdAt === "string"
      ? formatDate(new Date(post.createdAt))
      : formatDate(post.createdAt);

  return (
    <article className="blog-post__content">
      {/* Categories */}
      {post.categories && post.categories.length > 0 && (
        <div className="blog-post__categories">
          {post.categories.map((category) => (
            <Link
              key={category.id}
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
        <time className="blog-post__date">{formattedDate}</time>
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

      {/* Table of Contents - generowane dynamicznie z nagłówków */}
      <TableOfContents content={post.content} />

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

      {/* Share buttons */}
      <div className="blog-post__share">
        <h3 className="blog-post__share-title">Udostępnij ten artykuł:</h3>
        <ShareButtonsClient url={url} title={post.title} />
      </div>

      {/* Author info */}
      <AuthorCard author={post.author} />

      {/* Related posts */}
      {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
    </article>
  );
}

// Komponent tablicy treści generowanej z nagłówków
function TableOfContents({ content }: { content: any }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    if (!content || !Array.isArray(content)) return;

    // Pobierz wszystkie nagłówki z zawartości
    const headingBlocks = content.filter(
      (block) =>
        block._type === "block" && ["h2", "h3", "h4"].includes(block.style)
    );

    const extractedHeadings = headingBlocks.map((block) => {
      // Połącz tekst z children
      const text = block.children.map((child: any) => child.text).join("");

      // Generuj ID z tekstu nagłówka
      const id = text
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      // Określ poziom nagłówka
      const level = parseInt(block.style.replace("h", ""));

      return { id, text, level };
    });

    if (extractedHeadings.length > 2) {
      setHeadings(extractedHeadings);
    }
  }, [content]);

  // Nie wyświetlaj TOC, jeśli jest za mało nagłówków
  if (headings.length < 3) return null;

  return (
    <div className="blog-post__toc">
      <h2 className="blog-post__toc-title">Spis treści</h2>
      <ul className="blog-post__toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`blog-post__toc-item blog-post__toc-item--h${heading.level}`}
          >
            <a href={`#${heading.id}`} className="blog-post__toc-link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
