// lib/blog.ts
import { getClient, ptToPlainText, calculateReadingTime } from "./sanity";
import { Post, PaginatedPosts, PostFilters, Category } from "./types";

/**
 * Pobiera post według sluga
 * @param slug - Slug posta
 * @returns Post lub null jeśli nie znaleziono
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = getClient();

  // Sanity GROQ query
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      content,
      "coverImage": coverImage.asset->url,
      published,
      featuredPost,
      _createdAt,
      _updatedAt,
      "author": author-> {
        _id,
        name,
        "image": image.asset->url,
        bio
      },
      "categories": categories[]-> {
        _id,
        name,
        "slug": slug.current
      },
      seo
    }
  `;

  const post = await client.fetch(query, { slug });

  // Jeśli nie znaleziono posta
  if (!post) return null;

  // Mapuj dane z Sanity na oczekiwane w aplikacji
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    published: post.published,
    featuredPost: post.featuredPost,
    createdAt: post._createdAt,
    updatedAt: post._updatedAt,
    author: {
      id: post.author?._id,
      name: post.author?.name,
      image: post.author?.image,
      bio: post.author?.bio,
    },
    categories:
      post.categories?.map((category: any) => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
      })) || [],
    seo: post.seo,
    readingTime: calculateReadingTime(post.content),
  };
}

/**
 * Pobiera paginowane posty z opcjonalnym filtrowaniem
 * @param filters - Filtry do zastosowania
 * @returns Obiekt z postami, liczbą postów i informacjami o paginacji
 */
export async function getPaginatedPosts(
  filters: PostFilters = {}
): Promise<PaginatedPosts> {
  const {
    page = 1,
    limit = 6,
    categorySlug = null,
    searchQuery = null,
    authorId = null,
    featured = false,
  } = filters;

  const client = getClient();

  // Buduj warunki filtrowania
  let conditions = ['_type == "post" && published == true'];

  if (categorySlug) {
    conditions.push("$categorySlug in categories[]->slug.current");
  }

  if (searchQuery) {
    conditions.push("(title match $searchQuery || excerpt match $searchQuery)");
  }

  if (authorId) {
    conditions.push("author._ref == $authorId");
  }

  if (featured) {
    conditions.push("featuredPost == true");
  }

  const whereClause = conditions.join(" && ");

  // Zapytanie GROQ do pobrania postów
  const query = `{
    "posts": *[${whereClause}] | order(_createdAt desc) [$skip..$limit] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage.asset->url,
      published,
      featuredPost,
      _createdAt,
      "author": author-> {
        _id,
        name,
        "image": image.asset->url
      },
      "categories": categories[]-> {
        _id,
        name,
        "slug": slug.current
      }
    },
    "total": count(*[${whereClause}])
  }`;

  // Parametry dla zapytania
  const params = {
    categorySlug,
    searchQuery: searchQuery ? `*${searchQuery}*` : null,
    authorId,
    skip: (page - 1) * limit,
    limit: page * limit - 1,
  };

  const result = await client.fetch(query, params);

  // Oblicz liczbę stron
  const totalPages = Math.ceil(result.total / limit);

  // Mapuj dane z Sanity na oczekiwane w aplikacji
  const posts = result.posts.map((post: any) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    published: post.published,
    featuredPost: post.featuredPost,
    createdAt: post._createdAt,
    author: {
      id: post.author?._id,
      name: post.author?.name,
      image: post.author?.image,
    },
    categories:
      post.categories?.map((category: any) => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
      })) || [],
  }));

  return {
    posts,
    total: result.total,
    totalPages,
    currentPage: page,
  };
}

/**
 * Pobiera najnowsze posty
 * @param limit - Liczba postów do pobrania
 * @returns Tablica postów
 */
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  const result = await getPaginatedPosts({ limit, page: 1 });
  return result.posts;
}

/**
 * Pobiera wyróżnione posty
 * @param limit - Liczba postów do pobrania
 * @returns Tablica postów
 */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const result = await getPaginatedPosts({ limit, page: 1, featured: true });
  return result.posts;
}

/**
 * Pobiera powiązane posty
 * @param postId - ID bieżącego posta (do wykluczenia)
 * @param categoryIds - Tablica ID kategorii do filtrowania
 * @param limit - Liczba postów do pobrania
 * @returns Tablica powiązanych postów
 */
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[] = [],
  limit = 3
): Promise<Post[]> {
  const client = getClient();

  // Zapytanie GROQ
  const query = `
    *[_type == "post" && _id != $postId && published == true && count((categories[]->_id)[@ in $categoryIds]) > 0] | order(_createdAt desc) [0...${limit}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage.asset->url,
      _createdAt,
      "categories": categories[]-> {
        _id,
        name,
        "slug": slug.current
      }
    }
  `;

  const posts = await client.fetch(query, { postId, categoryIds });

  // Jeśli nie ma wystarczająco powiązanych postów, pobierz najnowsze
  if (posts.length < limit) {
    const backupQuery = `
      *[_type == "post" && _id != $postId && published == true] | order(_createdAt desc) [0...${limit - posts.length}] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        "coverImage": coverImage.asset->url,
        _createdAt,
        "categories": categories[]-> {
          _id,
          name,
          "slug": slug.current
        }
      }
    `;

    const additionalPosts = await client.fetch(backupQuery, { postId });
    posts.push(...additionalPosts);
  }

  // Mapuj dane
  return posts.map((post: any) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    published: true,
    createdAt: post._createdAt,
    categories:
      post.categories?.map((category: any) => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
      })) || [],
  }));
}

/**
 * Pobiera wszystkie kategorie
 * @returns Tablica kategorii
 */
export async function getCategories(): Promise<Category[]> {
  const client = getClient();

  const query = `
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      _createdAt,
      _updatedAt
    }
  `;

  const categories = await client.fetch(query);

  return categories.map((category: any) => ({
    id: category._id,
    name: category.name,
    slug: category.slug,
    createdAt: category._createdAt,
    updatedAt: category._updatedAt,
  }));
}

/**
 * Pobiera najpopularniejsze kategorie (z największą liczbą postów)
 * @param limit - Liczba kategorii do pobrania
 * @returns Tablica kategorii z liczbą postów
 */
export async function getPopularCategories(
  limit = 5
): Promise<(Category & { postCount: number })[]> {
  const client = getClient();

  const query = `
    *[_type == "category"] {
      _id,
      name,
      "slug": slug.current,
      "postCount": count(*[_type == "post" && references(^._id) && published == true])
    } | order(postCount desc) [0...${limit}]
  `;

  const categories = await client.fetch(query);

  return categories.map((category: any) => ({
    id: category._id,
    name: category.name,
    slug: category.slug,
    postCount: category.postCount,
  }));
}
