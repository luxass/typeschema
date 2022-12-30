import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  external: ["typescript"],
  clean: true,
  treeshake: true,
  dts: true
});
