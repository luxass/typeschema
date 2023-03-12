import { defineConfig } from "tsup";

import { version } from "./package.json";

const entry = ["src/cli.ts", "src/index.ts", "src/config.ts", "src/plugin.ts"];

export default defineConfig({
  entry,
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  external: ["typescript", "prompts", "@swc/core"],
  define: {
    __VERSION__: `'${version}'`
  }
});
