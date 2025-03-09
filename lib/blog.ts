import { prisma } from "./prisma";
import { createSlug } from "./utils";

// Definicje typów zgodne z Prisma
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  published: boolean;
  featuredPost: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

// Funkcje dostępu do danych

/**
 * Pobieranie najnowszych postów
 */
export async function getLatestPosts(limit = 10): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
}

/**
 * Pobieranie wyróżnionych postów
 */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      featuredPost: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
}

/**
 * Pobieranie postów z paginacją i filtrowaniem wg kategorii
 */
export async function getPaginatedPosts(options: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  searchQuery?: string;
}): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const { page = 1, limit = 9, categorySlug, searchQuery } = options;

  const skip = (page - 1) * limit;

  // Budowanie zapytania where
  const where: any = {
    published: true,
  };

  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  if (searchQuery) {
    where.OR = [
      {
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        excerpt: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ];
  }

  // Pobieranie postów z uwzględnieniem filtrów
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    posts: posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    })),
    total,
    totalPages,
  };
}

/**
 * Pobieranie kategorii
 */
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Pobieranie pojedynczego posta po slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) return null;

  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

/**
 * Tworzenie nowego posta
 */
export async function createPost(data: {
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  authorId: string;
  categoryIds?: string[];
  published?: boolean;
  featuredPost?: boolean;
}) {
  const { title, categoryIds = [], ...rest } = data;

  // Tworzenie slug z tytułu
  const slug = createSlug(title);

  return await prisma.post.create({
    data: {
      title,
      slug,
      ...rest,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },
    include: {
      categories: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

/**
 * Aktualizacja posta
 */
export async function updatePost(
  id: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    published?: boolean;
    featuredPost?: boolean;
    categoryIds?: string[];
  }
) {
  const { title, categoryIds, ...rest } = data;

  // Jeśli tytuł się zmienił, aktualizuj również slug
  const slug = title ? createSlug(title) : undefined;

  // Przygotowanie danych do aktualizacji
  const updateData: any = {
    ...rest,
  };

  if (title) {
    updateData.title = title;
    updateData.slug = slug;
  }

  if (categoryIds) {
    updateData.categories = {
      set: [], // Najpierw usuwamy wszystkie istniejące połączenia
      connect: categoryIds.map((id) => ({ id })),
    };
  }

  return await prisma.post.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      categories: true,
      author: true,
    },
  });
}

/**
 * Usuwanie posta
 */
export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
}

/**
 * Pobieranie powiązanych postów
 */
export async function getRelatedPosts(
  postId: string,
  limit = 3
): Promise<Post[]> {
  // Pobierz kategorie obecnego posta
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    include: { categories: true },
  });

  if (!currentPost) return [];

  const categoryIds = currentPost.categories.map((cat) => cat.id);

  // Znajdź posty w tych samych kategoriach, ale bez obecnego posta
  const posts = await prisma.post.findMany({
    where: {
      id: { not: postId },
      published: true,
      categories: {
        some: {
          id: { in: categoryIds },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
}
