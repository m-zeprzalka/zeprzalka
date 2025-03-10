export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { getLatestPosts } from "@/lib/blog";

// Metadane dla SEO
export const metadata: Metadata = {
  title: "Michał Zeprzałka - Zamieniam pomysły w cyfrową rzeczywistość",
  description:
    "14 lat doświadczenia w realizacji zleceń. Rozwiązania marketingowe z użyciem AI.",
  openGraph: {
    title: "Michał Zeprzałka - Zamieniam pomysły w cyfrową rzeczywistość",
    description:
      "14 lat doświadczenia w realizacji zleceń. Rozwiązania marketingowe z użyciem AI.",
    images: ["/images/og-image.jpg"],
  },
};

export default async function Home() {
  // Pobierz dane
  const posts = await getLatestPosts();

  return (
    <main>
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            {/* Efekt glitch dopasowany do obrazka */}
            <div
              className="hero__image-wrapper"
              style={{ position: "relative", width: 300, height: 400 }}
            >
              <div
                className="glitch-effect"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url('/face-beta.webp')`,
                }}
              >
                <Image
                  src="/face-beta.webp"
                  alt="Michał Zeprzałka"
                  width={300}
                  height={300}
                  className="glitch-effect__img"
                  priority
                />
              </div>
            </div>

            <div className="hero__text">
              <h1 className="hero__title">
                ZAMIENIAM POMYSŁY
                <br />W CYFROWĄ
                <br />
                RZECZYWISTOŚĆ
              </h1>

              <div className="hero__description">
                <p className="hero__subtitle">
                  <span>/ </span>14 Lat doświadczenia w realizacji zleceń
                </p>
                <p className="hero__subtitle">
                  <span>/ </span>8 Lat w branży edukacyjnej
                </p>
                <p className="hero__subtitle">
                  <span>/ </span>
                  Rozwiązania marketingowe z użyciem AI
                </p>
              </div>
              <div className="hero__buttons">
                <Link href="/blog" className="button button--primary">
                  ZOBACZ BLOG
                </Link>
                <Link href="/kontakt" className="button button--secondary">
                  KONTAKT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-preview">
        <div className="blog-preview__container">
          <h2 className="blog-preview__title">Najnowsze wpisy</h2>
          <BlogList posts={posts} />
        </div>
      </section>
    </main>
  );
}
