"use client";

import { useEffect } from "react";
import { TocScript } from "./tocScript";
import BlogPostContent from "./BlogPostContent";
import { Post } from "@/lib/types";

type BlogPostWrapperProps = {
  post: Post;
  relatedPosts?: Post[];
  url: string;
};

export default function BlogPostWrapper({
  post,
  relatedPosts = [],
  url,
}: BlogPostWrapperProps) {
  // Hook do obsługi podświetlania kodu
  useEffect(() => {
    // Jeśli istnieje funkcja Prism.highlightAll(), wywołaj ją
    if (
      typeof window !== "undefined" &&
      window.Prism &&
      window.Prism.highlightAll
    ) {
      window.Prism.highlightAll();
    }
  }, [post.content]);

  return (
    <>
      <BlogPostContent post={post} relatedPosts={relatedPosts} url={url} />
      {/* Skrypt do obsługi TOC */}
      <TocScript />
    </>
  );
}
