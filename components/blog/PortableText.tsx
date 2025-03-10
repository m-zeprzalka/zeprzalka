// components/blog/PortableText.tsx
import { Fragment } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function PortableText({ content }: { content: any }) {
  // Zabezpieczenie przed brakiem treści
  if (!content) {
    return null;
  }

  // Jeśli treść jest stringiem (np. HTML), wyświetl ją bezpośrednio
  if (typeof content === "string") {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Dla prostej obsługi danych Portable Text bez biblioteki @portabletext/react
  // Renderujemy tylko podstawowe bloki tekstu
  if (Array.isArray(content)) {
    return (
      <div className="portable-text">
        {content.map((block, blockIndex) => {
          // Obsługa bloków tekstu
          if (block._type === "block") {
            const textStyle = block.style || "normal";
            const TextComponent = getTextComponent(textStyle);

            return (
              <TextComponent
                key={blockIndex}
                className={`portable-text__${textStyle}`}
              >
                {block.children?.map((child: any, childIndex: number) => {
                  // Renderowanie tekstu z formatowaniem
                  return (
                    <Fragment key={childIndex}>{renderText(child)}</Fragment>
                  );
                })}
              </TextComponent>
            );
          }

          // Obsługa obrazów
          if (block._type === "image" && block.asset) {
            return (
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
          }

          // Dla innych typów bloków możemy dodać więcej obsługi
          return null;
        })}
      </div>
    );
  }

  // Domyślnie wyświetl prostą informację
  return (
    <p className="portable-text__fallback">
      Treść jest w formacie, który wymaga komponentu PortableText.
    </p>
  );
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

// Funkcja pomocnicza do renderowania tekstu z formatowaniem
function renderText(child: any) {
  const text = child.text || "";

  if (child.marks && child.marks.length > 0) {
    if (child.marks.includes("strong")) {
      return <strong>{text}</strong>;
    }
    if (child.marks.includes("em")) {
      return <em>{text}</em>;
    }
    if (child.marks.includes("code")) {
      return <code>{text}</code>;
    }
    // Można dodać więcej formatowania w razie potrzeby
  }

  return text;
}
