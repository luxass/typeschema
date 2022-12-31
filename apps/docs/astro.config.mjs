import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [tailwind(), mdx(), sitemap(), preact(), react()],
  site: "https://typeschema.vercel.app"
});
