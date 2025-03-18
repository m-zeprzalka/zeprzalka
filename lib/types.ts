// lib/types.ts
// Główne typy dla aplikacji

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type Author = {
  id: string;
  name: string | null;
  email?: string | null;
  image?: string | null;
  bio?: string | null;
  role?: "ADMIN" | "USER";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

// Typy dla Portable Text
export type TextMark =
  | "strong"
  | "em"
  | "code"
  | "underline"
  | "strike-through"
  | "highlight"
  | string;

export type TextChild = {
  _key: string;
  _type: "span";
  marks: TextMark[];
  text: string;
};

export type LinkMark = {
  _key: string;
  _type: "link";
  href: string;
  blank?: boolean;
};

export type TextBlock = {
  _key: string;
  _type: "block";
  children: TextChild[];
  markDefs: LinkMark[];
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
  listItem?: "bullet" | "number";
};

export type CodeBlock = {
  _key: string;
  _type: "code";
  code: string;
  language: string;
  filename?: string;
};

export type TableBlock = {
  _key: string;
  _type: "table";
  header?: {
    cells: string[];
  };
  rows: {
    _key: string;
    cells: string[];
  }[];
};

export type EmbedBlock = {
  _key: string;
  _type: "embed";
  url?: string;
  html?: string;
  caption?: string;
};

export type CalloutBlock = {
  _key: string;
  _type: "callout";
  tone: "default" | "info" | "warning" | "success" | "error";
  icon?: string;
  content: string;
};

export type PortableTextBlock =
  | TextBlock
  | SanityImage
  | CodeBlock
  | TableBlock
  | EmbedBlock
  | CalloutBlock;

// Rozszerzony typ dla postów blogowych
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: PortableTextBlock[] | string | null;
  coverImage?: string | null;
  published: boolean;
  featuredPost?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  author: Author;
  categories: Category[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
  readingTime?: number;
};

// Typ dla danych paginowanych
export type PaginatedPosts = {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
};

// Dla filtracji/wyszukiwania
export type PostFilters = {
  page?: number;
  limit?: number;
  categorySlug?: string | null;
  searchQuery?: string | null;
  authorId?: string | null;
  featured?: boolean;
};
