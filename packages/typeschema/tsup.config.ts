import { defineConfig } from "tsup";

import { version } from "./package.json";

const workers = ["src/workers/json-schema-worker.ts", "src/workers/zod-schema-worker.ts"];
const entry = ["src/cli.ts", "src/index.ts", "src/config.ts", "src/esbuild-plugin.ts"];

export default defineConfig({
  entry: [...entry, ...workers],
  format: ["esm", "cjs"],
  clean: true,
  treeshake: true,
  dts: true,
  external: ["typescript"],
  define: {
    __VERSION__: `'${version}'`
  }
});
