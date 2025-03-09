// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Usuń istniejące dane (opcjonalnie)
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Utwórz użytkownika admina
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Michał Zeprzałka",
      email: "admin@zeprzalka.pl",
      password: adminPassword,
      role: "ADMIN",
      bio: "Specjalista z wieloletnim doświadczeniem w dziedzinie marketingu cyfrowego, AI i technologii webowych. Dzielę się wiedzą i pomagam rozwijać biznesy z wykorzystaniem nowoczesnych narzędzi.",
    },
  });

  console.log(`Utworzono użytkownika admin: ${admin.email}`);

  // Utwórz kategorie
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Marketing",
        slug: "marketing",
      },
    }),
    prisma.category.create({
      data: {
        name: "AI",
        slug: "ai",
      },
    }),
    prisma.category.create({
      data: {
        name: "Web Development",
        slug: "web-development",
      },
    }),
    prisma.category.create({
      data: {
        name: "UI/UX",
        slug: "ui-ux",
      },
    }),
    prisma.category.create({
      data: {
        name: "Design",
        slug: "design",
      },
    }),
  ]);

  console.log(`Utworzono ${categories.length} kategorii`);

  // Utwórz przykładowe posty
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Jak wykorzystać AI w marketingu",
        slug: "jak-wykorzystac-ai-w-marketingu",
        excerpt:
          "Praktyczne wskazówki implementacji sztucznej inteligencji w strategiach marketingowych.",
        content: `# Jak wykorzystać AI w marketingu

W dzisiejszym dynamicznie zmieniającym się świecie technologia sztucznej inteligencji (AI) staje się niezbędnym narzędziem w arsenale każdego marketera. Automatyzacja, personalizacja i analiza danych to tylko niektóre obszary, w których AI może pomóc firmom osiągnąć lepsze wyniki.

## Personalizacja treści

Dzięki AI możesz tworzyć spersonalizowane treści dla różnych segmentów swojej grupy docelowej. Algorytmy uczenia maszynowego mogą analizować zachowania użytkowników i dostarczać im treści, które są najbardziej relewantne dla ich zainteresowań i potrzeb.

## Automatyzacja kampanii marketingowych

AI pozwala na automatyzację wielu aspektów kampanii marketingowych, od planowania i tworzenia treści, po optymalizację budżetu i analizę wyników.

## Chatboty i obsługa klienta

Inteligentne chatboty mogą znacząco poprawić doświadczenie klienta, odpowiadając na pytania 24/7 i kierując bardziej skomplikowane sprawy do odpowiednich działów.

## Analiza sentymentu

AI pozwala analizować opinie klientów wyrażane w mediach społecznościowych, recenzjach i innych źródłach, co pomaga firmom lepiej zrozumieć nastroje i potrzeby swoich odbiorców.

## Podsumowanie

Wykorzystanie AI w marketingu to już nie przyszłość, ale teraźniejszość. Firmy, które potrafią skutecznie wdrożyć te narzędzia, zyskują przewagę konkurencyjną i mogą lepiej odpowiadać na potrzeby swoich klientów.`,
        createdAt: new Date("2023-12-15"),
        published: true,
        featuredPost: true,
        authorId: admin.id,
        categories: {
          connect: [
            { id: categories[0].id }, // Marketing
            { id: categories[1].id }, // AI
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "Nowoczesny web development z Next.js",
        slug: "nowoczesny-web-development-z-nextjs",
        excerpt:
          "Przewodnik po budowaniu wydajnych aplikacji webowych z użyciem Next.js i React.",
        content: `# Nowoczesny web development z Next.js

Next.js to framework React, który umożliwia tworzenie wydajnych aplikacji internetowych z renderowaniem po stronie serwera (SSR), generowaniem statycznych stron (SSG) i wieloma innymi funkcjami.

## Dlaczego warto używać Next.js?

- **Renderowanie po stronie serwera** - poprawia SEO i wydajność pierwszego ładowania strony
- **Automatyczny code splitting** - ładuje tylko niezbędny kod JavaScript dla każdej strony
- **API Routes** - pozwala na tworzenie API bezpośrednio w aplikacji Next.js
- **Wsparcie dla TypeScript** - zapewnia typowanie statyczne dla bezpieczniejszego kodu

## Rozpoczęcie pracy z Next.js

Aby rozpocząć nowy projekt Next.js, wystarczy wykonać kilka prostych kroków.

## Routing w Next.js

Next.js oferuje intuicyjny system routingu oparty na plikach.

## Optymalizacja obrazów

Next.js oferuje wbudowany komponent Image do optymalizacji obrazów.

## Podsumowanie

Next.js to potężne narzędzie dla nowoczesnego web developmentu, które łączy w sobie zalety frameworka React z rozwiązaniami zorientowanymi na wydajność i SEO. Niezależnie od tego, czy tworzysz prostą stronę internetową, czy złożoną aplikację, Next.js może pomóc Ci zbudować lepsze doświadczenie dla użytkownika.`,
        createdAt: new Date("2023-11-20"),
        published: true,
        featuredPost: true,
        authorId: admin.id,
        categories: {
          connect: [
            { id: categories[2].id }, // Web Development
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "Design system - klucz do skalowalnego interfejsu",
        slug: "design-system-klucz-do-skalowalnego-interfejsu",
        excerpt:
          "Jak stworzyć spójny i skalowalny design system dla Twojego produktu.",
        content: `# Design system - klucz do skalowalnego interfejsu

Design system to zbiór standardów, komponentów i wytycznych, które pomagają zachować spójność designu w całym produkcie. W tym artykule omówimy korzyści z posiadania design systemu oraz kroki do jego stworzenia.

## Co to jest design system?

Design system to więcej niż biblioteka komponentów czy paleta kolorów. To kompleksowe podejście do projektowania, które obejmuje:

- Zasady projektowe i wartości
- Komponenty UI i wzorce
- Wytyczne dotyczące pisania tekstów
- Ikonografię i zasoby wizualne
- Dokumentację dla projektantów i deweloperów

## Dlaczego warto mieć design system?

- **Spójność** - wszyscy użytkownicy doświadczają tego samego, spójnego interfejsu
- **Efektywność** - zespoły mogą szybciej projektować i wdrażać nowe funkcje
- **Skalowalność** - system rośnie wraz z produktem
- **Lepsza współpraca** - projektanci i programiści mówią tym samym językiem

## Jak stworzyć własny design system?

### 1. Audyt istniejącego interfejsu

Pierwszym krokiem jest przeprowadzenie audytu istniejącego interfejsu, aby zobaczyć, jakie elementy są już używane i gdzie brakuje spójności.

### 2. Definiowanie fundamentów

Zacznij od podstawowych elementów.

### 3. Tworzenie komponentów

Stwórz bibliotekę komponentów wielokrotnego użytku.

### 4. Dokumentacja

Stwórz kompleksową dokumentację, która wyjaśnia:
- Jak i kiedy używać komponentów
- Zasady projektowe
- Przykłady użycia

## Narzędzia do tworzenia design systemów

- **Figma** - do projektowania komponentów wizualnych
- **Storybook** - do dokumentowania i testowania komponentów
- **Styled Components / Tailwind CSS** - do implementacji stylów

## Wnioski

Design system to inwestycja długoterminowa, która wymaga czasu i zasobów, ale korzyści z jego posiadania są ogromne. Spójny, dobrze udokumentowany design system może znacząco przyspieszyć rozwój produktu i poprawić doświadczenie użytkownika.`,
        createdAt: new Date("2023-10-05"),
        published: true,
        featuredPost: false,
        authorId: admin.id,
        categories: {
          connect: [
            { id: categories[3].id }, // UI/UX
            { id: categories[4].id }, // Design
          ],
        },
      },
    }),
  ]);

  console.log(`Utworzono ${posts.length} postów`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
