import * as Nextra from "nextra";

const withNextra = Nextra.default({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx"
});

export default withNextra();
