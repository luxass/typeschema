import { defineConfig } from "tsup";

import { version } from "./package.json";

const sharedConfig = {
  clean: true,
  treeshake: true,
  external: ["typescript"],
  define: {
    __VERSION__: `'${version}'`
  }
};

export default defineConfig([
  // CLI Config
  {
    ...sharedConfig,
    entry: [
      "src/cli.ts"
    ],
    dts: false,
    format: ["esm"]
  },
  // Library Config
  {
    ...sharedConfig,
    entry: [
      "src/index.ts"
    ],
    dts: true,
    format: ["esm", "cjs"]
  }
]);
