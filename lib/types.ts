// lib/types.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any;
  coverImage?: string | null;
  published: boolean;
  featuredPost: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}
