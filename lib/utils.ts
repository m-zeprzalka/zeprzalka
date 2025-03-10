import { format, parseISO } from "date-fns";
import pl from "date-fns/locale/pl";
import slugify from "slugify";

/**
 * Format a date using date-fns
 * @param date Date to format
 * @param formatStr Format string (optional)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  formatStr = "d MMMM yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: pl });
}

/**
 * Create a slug from a string
 * @param str String to slugify
 * @returns Slugified string
 */
export function createSlug(str: string): string {
  return slugify(str, {
    lower: true,
    strict: true,
    locale: "pl",
  });
}

/**
 * Truncate text to a specific length
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length = 150): string {
  if (text.length <= length) return text;

  return text.substring(0, length).trim() + "...";
}

/**
 * Get the reading time of a text in minutes
 * @param text Text to analyze
 * @returns Reading time in minutes
 */
export function getReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime === 0 ? 1 : readingTime;
}

/**
 * Parse and sanitize HTML content (basic)
 * @param html HTML content
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // This is a very basic sanitization
  // For production, use a proper HTML sanitizer like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "");
}

/**
 * Check if a URL is external
 * @param url URL to check
 * @returns Boolean indicating if URL is external
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;

  return (
    /^https?:\/\//.test(url) &&
    !url.startsWith(process.env.NEXT_PUBLIC_SITE_URL || "")
  );
}

/**
 * Generate SEO metadata for a page
 * @param title Page title
 * @param description Page description
 * @param image OG image path
 * @returns SEO metadata object
 */
export function generateSeoMetadata(
  title: string,
  description: string,
  image?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zeprzalka.pl";
  const ogImage = image || "/images/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      url: baseUrl,
      siteName: "Michał Zeprzałka",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}${ogImage}`],
    },
  };
}
