import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  external: ["typescript"],
  clean: true,
  treeshake: true,
  dts: true
});
