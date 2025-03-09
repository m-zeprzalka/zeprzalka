// components/blog/BlogList.tsx
import React from "react";
import BlogCard from "./BlogCard";
import { Post } from "@/lib/blog";

type BlogListProps = {
  posts: Post[];
};

export default function BlogList({ posts }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="blog-list-empty">
        <p>Nie znaleziono wpisów.</p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
