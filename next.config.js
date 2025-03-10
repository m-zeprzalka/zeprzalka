/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "cdn.sanity.io"], // Dodałem cdn.sanity.io do listy dozwolonych domen
  },
  sassOptions: {
    includePaths: ["./styles"], // Ścieżki do stylów SCSS
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
