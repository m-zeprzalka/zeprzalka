import { sanityClient, urlFor } from "./sanity";
import { createSlug } from "./utils";
import { Post } from "./types"; // Zmiana na poprawny import

// Pomocnicza funkcja do mapowania postów z Sanity na nasz format
function mapPost(post: any): Post {
  if (!post) {
    console.error("Próba mapowania null/undefined post");
    throw new Error("Nie można mapować pustego postu");
  }

  console.log(
    "Mapowanie postu:",
    post._id,
    post.title,
    "slug:",
    post.slug?.current
  );

  return {
    id: post._id,
    title: post.title || "Bez tytułu",
    slug: post.slug?.current || createSlug(post.title || "bez-tytulu"),
    excerpt: post.excerpt,
    // Ważna zmiana - sprawdź, czy content jest tablicą (format Portable Text)
    content: Array.isArray(post.content) ? post.content : [],
    coverImage: post.coverImage ? urlFor(post.coverImage).url() : null,
    published: Boolean(post.published),
    featuredPost: Boolean(post.featuredPost),
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    authorId: post.author?._id || "",
    author: {
      id: post.author?._id || "",
      name: post.author?.name || "Nieznany autor",
      image: post.author?.image ? urlFor(post.author.image).url() : null,
    },
    categories: post.categories
      ? post.categories.map((cat: any) => ({
          id: cat._id,
          name: cat.name || "Bez nazwy",
          slug: cat.slug?.current || "bez-kategorii",
        }))
      : [],
  };
}

/**
 * Pobieranie najnowszych postów
 */
export async function getLatestPosts(limit = 10): Promise<Post[]> {
  const posts = await sanityClient.fetch(`
    *[_type == "post" && published == true] | order(createdAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      featuredPost,
      createdAt,
      updatedAt,
      author->{
        _id,
        name,
        image
      },
      categories[]->{
        _id,
        name,
        slug
      }
    }
  `);

  return posts.map(mapPost);
}

/**
 * Pobieranie wyróżnionych postów
 */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await sanityClient.fetch(`
    *[_type == "post" && published == true && featuredPost == true] | order(createdAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      featuredPost,
      createdAt,
      updatedAt,
      author->{
        _id,
        name,
        image
      },
      categories[]->{
        _id,
        name,
        slug
      }
    }
  `);

  return posts.map(mapPost);
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

  // Budowanie zapytania GROQ
  let query = '*[_type == "post" && published == true';

  if (categorySlug) {
    query += ` && count(categories[slug.current == "${categorySlug}"]) > 0`;
  }

  if (searchQuery) {
    query += ` && (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*" || content match "*${searchQuery}*")`;
  }

  query += `] | order(createdAt desc)`;

  // Pobieranie postów z uwzględnieniem paginacji
  const posts = await sanityClient.fetch(`
    ${query}[${skip}...${skip + limit}] {
      _id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      featuredPost,
      createdAt,
      updatedAt,
      author->{
        _id,
        name,
        image
      },
      categories[]->{
        _id,
        name,
        slug
      }
    }
  `);

  // Pobieranie całkowitej liczby postów
  const total = await sanityClient.fetch(`count(${query})`);

  const totalPages = Math.ceil(total / limit);

  return {
    posts: posts.map(mapPost),
    total,
    totalPages,
  };
}

/**
 * Pobieranie kategorii
 */
export async function getCategories() {
  const categories = await sanityClient.fetch(`
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug
    }
  `);

  return categories.map((cat: any) => ({
    id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || createSlug(cat.name || "bez-nazwy"),
  }));
}

/**
 * Pobieranie pojedynczego posta po slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await sanityClient.fetch(
      `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
        featuredPost,
        createdAt,
        updatedAt,
        author->{
          _id,
          name,
          image
        },
        categories[]->{
          _id,
          name,
          slug
        }
      }
    `,
      { slug }
    );

    // Usuń lub zmodyfikuj logowanie, które może powodować problemy z serializacją
    // console.log("Otrzymany post z Sanity:", post);

    if (!post) {
      return null;
    }

    const mappedPost = mapPost(post);
    // console.log("Zmapowany post:", mappedPost);
    return mappedPost;
  } catch (error) {
    console.error("Błąd podczas pobierania posta:", error);
    return null;
  }
}

/**
 * Pobieranie powiązanych postów
 */
export async function getRelatedPosts(
  postId: string,
  limit = 3
): Promise<Post[]> {
  // Pobieramy najpierw kategorie bieżącego posta
  const post = await sanityClient.fetch(
    `
    *[_type == "post" && _id == $postId][0] {
      categories[]->._id
    }
  `,
    { postId }
  );

  if (!post || !post.categories || post.categories.length === 0) {
    return [];
  }

  // Tworzymy tablicę ID kategorii
  const categoryIds = post.categories.map((cat: any) => cat);

  // Pobieramy powiązane posty
  const relatedPosts = await sanityClient.fetch(
    `
    *[_type == "post" && _id != $postId && published == true && count(categories[_id in $categoryIds]) > 0] | order(createdAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      featuredPost,
      createdAt,
      updatedAt,
      author->{
        _id,
        name,
        image
      },
      categories[]->{
        _id,
        name,
        slug
      }
    }
  `,
    { postId, categoryIds }
  );

  return relatedPosts.map(mapPost);
}

// Eksportuj typy lub interfejsy z tego pliku, aby inne pliki mogły je importować
export type { Post };
