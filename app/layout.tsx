import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/main.scss";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Michał Zeprzałka - Zamieniam pomysły w cyfrową rzeczywistość",
  description:
    "14 lat doświadczenia w realizacji zleceń. Rozwiązania marketingowe z użyciem AI.",
  metadataBase: new URL("https://zeprzalka.pl"),

  // Dodatkowe metadane
  keywords:
    "marketing cyfrowy, AI, automatyzacja, rozwój biznesu, edukacja online",
  authors: [{ name: "Michał Zeprzałka", url: "https://zeprzalka.pl" }],
  creator: "Michał Zeprzałka",
  publisher: "Michał Zeprzałka",

  // OpenGraph dla lepszego udostępniania w mediach społecznościowych
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://zeprzalka.pl",
    siteName: "Michał Zeprzałka",
    title: "Michał Zeprzałka - Zamieniam pomysły w cyfrową rzeczywistość",
    description:
      "14 lat doświadczenia w realizacji zleceń. Rozwiązania marketingowe z użyciem AI.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Michał Zeprzałka - rozwiązania cyfrowe i marketing",
      },
    ],
  },
  // Dodatkowe wskazówki dla robotów
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={publicSans.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
