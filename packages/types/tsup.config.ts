import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  external: ["typescript"],
  clean: true,
  treeshake: true,
  dts: {
    only: true
  }
});
