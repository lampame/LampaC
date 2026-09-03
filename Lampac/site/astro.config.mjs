import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

const hidden = ["/install", "/config", "/modules", "/api", "/changelog"];

export default defineConfig({
  site: "https://lampac.dev",
  output: "static",
  compressHTML: true,
  prefetch: {
    defaultStrategy: "hover",
  },
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    service: {
      config: {
        jpeg: { quality: 82 },
        webp: { quality: 80 },
        avif: { quality: 70 },
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 600, 800],
      styles: ["normal"],
      subsets: ["latin", "cyrillic"],
    },
  ],
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "ru",
        locales: {
          ru: "ru-RU",
          en: "en-US",
        },
      },
      filter: (page) => !hidden.some((path) => page.includes(path)),
    }),
  ],
});
