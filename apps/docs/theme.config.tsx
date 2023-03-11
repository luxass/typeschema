import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>TypeSchema</span>,
  project: {
    link: "https://github.com/luxass/typeschema"
  },
  docsRepositoryBase: "https://github.com/luxass/typeschema/apps/docs",
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} © <a href="https://luxass.dev" target="_blank">Lucas Nørgård</a>.
    </span>,
  }
};

export default config;
