// lib/sanity.ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bo93waal";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-11-15";

// Klient Sanity do zwykłych zapytań
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Klient Sanity dla Live Preview (bez cache)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Funkcja pomocnicza do wybierania klienta w zależności od trybu
export const getClient = (preview = false) =>
  preview ? previewClient : client;

// Funkcja do budowania URL obrazów
const builder = imageUrlBuilder(client);

/**
 * Funkcja generująca URL obrazu z parametrami
 * @param source - Referencja obrazu z Sanity
 * @returns Builder URL obrazu, na którym można wywołać metody .width(), .height(), .url() itp.
 */
export function urlFor(source: any) {
  if (!source?.asset?._ref) {
    // Zwróć placeholder lub domyślny obraz, jeśli brak właściwego źródła
    return {
      url: () => "/placeholder-image.jpg",
      width: () => urlFor,
      height: () => urlFor,
      format: () => urlFor,
      quality: () => urlFor,
      auto: () => urlFor,
    };
  }
  return builder.image(source);
}

/**
 * Funkcja pomocnicza do formatowania bloków Portable Text
 * @param blocks - Bloki Portable Text
 * @returns Sformatowany tekst HTML (bardzo podstawowy)
 */
export function ptToPlainText(blocks: any[] = []) {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return "";
      }
      return block.children.map((child: any) => child.text).join("");
    })
    .join("\n\n");
}

/**
 * Funkcja pomocnicza do pobierania pierwszego akapitu z Portable Text
 * @param blocks - Bloki Portable Text
 * @param wordCount - Maksymalna liczba słów (domyślnie 30)
 * @returns Pierwszy akapit tekstu, przycięty do określonej liczby słów
 */
export function getFirstParagraph(blocks: any[] = [], wordCount = 30) {
  if (!blocks || !Array.isArray(blocks)) return "";

  // Znajdź pierwszy blok typu 'block' ze stylem 'normal' (paragraf)
  const firstParagraph = blocks.find(
    (block) => block._type === "block" && block.style === "normal"
  );

  if (!firstParagraph || !firstParagraph.children) return "";

  // Połącz tekst ze wszystkich dzieci bloku
  const text = firstParagraph.children.map((child: any) => child.text).join("");

  // Jeśli chcemy ograniczyć liczbę słów
  const words = text.split(" ");
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(" ") + "...";
  }

  return text;
}

/**
 * Funkcja pomocnicza do obliczania czasu czytania artykułu
 * @param blocks - Bloki Portable Text
 * @returns Szacowany czas czytania w minutach
 */
export function calculateReadingTime(blocks: any[] = []) {
  if (!blocks || !Array.isArray(blocks)) return 1;

  // Średnia prędkość czytania: 200 słów na minutę
  const wordsPerMinute = 200;

  // Licz tylko bloki tekstu
  const textBlocks = blocks.filter((block) => block._type === "block");

  // Policz wszystkie słowa we wszystkich blokach tekstu
  let wordCount = 0;
  textBlocks.forEach((block) => {
    if (block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });

  // Dodaj dodatkowy czas na przeglądanie obrazów, kodu itp.
  const imageBlocks = blocks.filter((block) => block._type === "image").length;
  const codeBlocks = blocks.filter((block) => block._type === "code").length;

  // Każdy obraz: +10 sekund, każdy blok kodu: +20 sekund
  const additionalTime = (imageBlocks * 10 + codeBlocks * 20) / 60;

  // Oblicz czas czytania i zaokrąglij w górę
  const readingTime = Math.ceil(wordCount / wordsPerMinute + additionalTime);

  // Zwróć co najmniej 1 minutę, nawet dla bardzo krótkich artykułów
  return Math.max(1, readingTime);
}
