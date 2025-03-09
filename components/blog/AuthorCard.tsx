import Image from "next/image";

type AuthorCardProps = {
  author: {
    id: string;
    name: string | null;
    image: string | null;
    bio?: string | null;
  };
};

export default function AuthorCard({ author }: AuthorCardProps) {
  const authorName = author.name || "Michał Zeprzałka";
  const authorBio =
    author.bio ||
    "Specjalista z wieloletnim doświadczeniem w dziedzinie marketingu cyfrowego, AI i technologii webowych. Dzielę się wiedzą i pomagam rozwijać biznesy z wykorzystaniem nowoczesnych narzędzi.";

  return (
    <div className="blog-post__author-card">
      <div className="blog-post__author-avatar">
        {author.image ? (
          <Image
            src={author.image}
            alt={authorName}
            width={80}
            height={80}
            className="blog-post__author-image"
          />
        ) : (
          <div className="blog-post__author-placeholder">{authorName[0]}</div>
        )}
      </div>

      <div className="blog-post__author-info">
        <h3 className="blog-post__author-name">{authorName}</h3>
        <p className="blog-post__author-bio">{authorBio}</p>

        <div className="blog-post__author-socials">
          <a
            href="https://twitter.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-post__author-social-link"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22 5.89696C21.2356 6.21763 20.4206 6.43401 19.5738 6.5313C20.4381 6.02742 21.0989 5.23869 21.4192 4.29529C20.5999 4.75905 19.6967 5.09458 18.7399 5.27504C17.9638 4.4911 16.8777 4 15.6938 4C13.4126 4 11.5675 5.84505 11.5675 8.12618C11.5675 8.44686 11.6032 8.75904 11.6739 9.05973C8.29631 8.89283 5.30064 7.23984 3.23833 4.75073C2.88675 5.35908 2.68333 6.0274 2.68333 6.74285C2.68333 8.09084 3.35853 9.2932 4.38878 10.0158C3.68757 9.99453 3.03146 9.81034 2.45519 9.50663C2.45519 9.5231 2.45519 9.54105 2.45519 9.55901C2.45519 11.5685 3.88274 13.2453 5.79172 13.6219C5.44998 13.7136 5.08943 13.7613 4.71633 13.7613C4.4546 13.7613 4.19959 13.7365 3.95137 13.6896C4.46899 15.3406 5.98829 16.5481 7.80034 16.5796C6.39069 17.7005 4.6301 18.3561 2.71602 18.3561C2.3857 18.3561 2.06037 18.3374 1.74072 18.2999C3.57174 19.4845 5.73181 20.16 8.05171 20.16C15.6837 20.16 19.8248 13.8275 19.8248 8.35756C19.8248 8.18589 19.8209 8.01422 19.8123 7.84407C20.6401 7.27232 21.4192 6.55685 22 5.73834L22 5.89696Z" />
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/example"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-post__author-social-link"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.335 18.339H15.67V14.162C15.67 13.166 15.65 11.884 14.28 11.884C12.891 11.884 12.679 12.968 12.679 14.089V18.339H10.013V9.75H12.573V10.92H12.608C12.966 10.246 13.836 9.533 15.136 9.533C17.836 9.533 18.336 11.311 18.336 13.624V18.339H18.335ZM7.003 8.575C6.79956 8.57526 6.59806 8.53537 6.41006 8.45761C6.22207 8.37984 6.05127 8.26574 5.90746 8.12184C5.76365 7.97793 5.64965 7.80706 5.57201 7.61901C5.49437 7.43097 5.4546 7.22944 5.455 7.026C5.4552 6.71983 5.54618 6.4206 5.7209 6.16615C5.89563 5.91169 6.14412 5.71343 6.43077 5.59645C6.71741 5.47947 7.03103 5.44905 7.33345 5.50889C7.63588 5.56873 7.91142 5.7165 8.12457 5.93002C8.33773 6.14354 8.48495 6.41926 8.54424 6.72171C8.60352 7.02415 8.57255 7.33765 8.45507 7.62413C8.33759 7.9106 8.13891 8.15886 7.88413 8.33327C7.62935 8.50768 7.32993 8.59829 7.024 8.598L7.003 8.575ZM8.339 18.339H5.666V9.75H8.339V18.339ZM19.67 3H4.329C3.593 3 3 3.58 3 4.297V19.703C3 20.42 3.594 21 4.328 21H19.67C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.67 3Z" />
            </svg>
          </a>

          <a
            href="https://facebook.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-post__author-social-link"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
