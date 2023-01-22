import { defineConfig } from "tsup";

import { version } from "./package.json";

const entry = ["src/cli.ts", "src/index.ts", "src/config.ts", "src/plugin.ts"];

export default defineConfig({
  entry,
  format: ["esm"],
  dts: {
    entry: entry.filter((file) => file !== "src/cli.ts")
  },
  clean: true,
  // treeshake: true,
  external: ["typescript"],
  define: {
    __VERSION__: `'${version}'`
  }
});
