// components/blog/PortableText.tsx
"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import Prism from "prismjs";

// Importuj podstawowe style Prism
import "prismjs/themes/prism.css";

// Importuj tylko te języki, które są dostępne bez dodatkowych zależności
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
// Usunięto problematyczne importy (prism-php, prism-python, prism-html)

export default function PortableText({ content }: { content: any }) {
  // Inicjalizuj Prism do podświetlania składni
  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, [content]);

  // Zabezpieczenie przed brakiem treści
  if (!content) {
    return null;
  }

  // Jeśli treść jest stringiem (np. HTML), wyświetl ją bezpośrednio
  if (typeof content === "string") {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Dla prostej obsługi danych Portable Text bez biblioteki @portabletext/react
  if (Array.isArray(content)) {
    let currentListItems: any[] = [];
    let currentListType: string | null = null;
    const blocks: JSX.Element[] = [];

    content.forEach((block, blockIndex) => {
      // Obsługa bloków list
      if (
        block._type === "block" &&
        (block.listItem === "bullet" || block.listItem === "number")
      ) {
        // Dodaj element do bieżącej listy
        if (currentListType === block.listItem) {
          currentListItems.push(block);
        } else {
          // Jeśli mamy już listę, dodaj ją do bloków
          if (currentListItems.length > 0) {
            const ListComponent = currentListType === "bullet" ? "ul" : "ol";
            blocks.push(
              <ListComponent
                key={`list-${blockIndex}`}
                className={`portable-text__list portable-text__list--${currentListType}`}
              >
                {currentListItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="portable-text__list-item">
                    {item.children?.map((child: any, childIndex: number) => (
                      <Fragment key={childIndex}>
                        {renderText(child, item.markDefs)}
                      </Fragment>
                    ))}
                  </li>
                ))}
              </ListComponent>
            );
            currentListItems = [];
          }
          // Rozpocznij nową listę
          currentListType = block.listItem;
          currentListItems.push(block);
        }
        return;
      } else if (currentListItems.length > 0) {
        // Zakończ poprzednią listę, jeśli istnieje
        const ListComponent = currentListType === "bullet" ? "ul" : "ol";
        blocks.push(
          <ListComponent
            key={`list-${blockIndex}`}
            className={`portable-text__list portable-text__list--${currentListType}`}
          >
            {currentListItems.map((item, itemIndex) => (
              <li key={itemIndex} className="portable-text__list-item">
                {item.children?.map((child: any, childIndex: number) => (
                  <Fragment key={childIndex}>
                    {renderText(child, item.markDefs)}
                  </Fragment>
                ))}
              </li>
            ))}
          </ListComponent>
        );
        currentListItems = [];
        currentListType = null;
      }

      // Obsługa zwykłych bloków tekstu
      if (block._type === "block" && !block.listItem) {
        const textStyle = block.style || "normal";
        const TextComponent = getTextComponent(textStyle);

        blocks.push(
          <TextComponent
            key={blockIndex}
            className={`portable-text__${textStyle}`}
          >
            {block.children?.map((child: any, childIndex: number) => (
              <Fragment key={childIndex}>
                {renderText(child, block.markDefs)}
              </Fragment>
            ))}
          </TextComponent>
        );
        return;
      }

      // Obsługa obrazów
      if (block._type === "image" && block.asset) {
        blocks.push(
          <figure key={blockIndex} className="portable-text__figure">
            <Image
              src={urlFor(block).url()}
              alt={block.alt || "Obraz"}
              width={800}
              height={450}
              className="portable-text__image"
            />
            {block.caption && (
              <figcaption className="portable-text__caption">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
        return;
      }

      // Obsługa bloków kodu
      if (block._type === "code") {
        blocks.push(
          <pre key={blockIndex} className="portable-text__code">
            <code className={`language-${block.language || "javascript"}`}>
              {block.code}
            </code>
          </pre>
        );
        return;
      }
    });

    // Dodaj ostatnią listę, jeśli istnieje
    if (currentListItems.length > 0) {
      const ListComponent = currentListType === "bullet" ? "ul" : "ol";
      blocks.push(
        <ListComponent
          key={`list-final`}
          className={`portable-text__list portable-text__list--${currentListType}`}
        >
          {currentListItems.map((item, itemIndex) => (
            <li key={itemIndex} className="portable-text__list-item">
              {item.children?.map((child: any, childIndex: number) => (
                <Fragment key={childIndex}>
                  {renderText(child, item.markDefs)}
                </Fragment>
              ))}
            </li>
          ))}
        </ListComponent>
      );
    }

    return <div className="portable-text">{blocks}</div>;
  }

  // Domyślnie wyświetl prostą informację
  return (
    <p className="portable-text__fallback">
      Treść jest w formacie, który wymaga komponentu PortableText.
    </p>
  );
}

// Funkcja pomocnicza do renderowania tekstu z adnotacjami i formatowaniem
function renderText(child: any, markDefs: any[] = []) {
  const text = child.text || "";

  if (!child.marks || child.marks.length === 0) {
    return text;
  }

  // Sprawdź, czy tekst ma adnotację linku
  const linkMark = child.marks.find((mark: string) => {
    return markDefs?.some(
      (def: any) => def._key === mark && def._type === "link"
    );
  });

  if (linkMark) {
    const linkDef = markDefs?.find((def: any) => def._key === linkMark);

    if (linkDef && linkDef.href) {
      const href = linkDef.href;
      const isExternal =
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="portable-text__link"
          >
            {text}
          </a>
        );
      } else {
        return (
          <Link href={href} className="portable-text__link">
            {text}
          </Link>
        );
      }
    }
  }

  // Obsługa dekoratorów (bold, italic, code)
  if (child.marks.includes("strong")) {
    return <strong>{text}</strong>;
  }

  if (child.marks.includes("em")) {
    return <em>{text}</em>;
  }

  if (child.marks.includes("code")) {
    return <code>{text}</code>;
  }

  // Inne formaty, jeśli są zdefiniowane
  if (child.marks.includes("underline")) {
    return <u>{text}</u>;
  }

  return text;
}

// Funkcja pomocnicza do wyboru odpowiedniego komponentu dla stylu tekstu
function getTextComponent(style: string) {
  switch (style) {
    case "h1":
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <h1 className={className}>{children}</h1>;
    case "h2":
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <h2 className={className}>{children}</h2>;
    case "h3":
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <h3 className={className}>{children}</h3>;
    case "h4":
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <h4 className={className}>{children}</h4>;
    case "blockquote":
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <blockquote className={className}>{children}</blockquote>;
    default:
      return ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => <p className={className}>{children}</p>;
  }
}
