import { defineConfig } from "typeschema/config";

import { ZodPlugin } from "@typeschema/zod-plugin";

export default defineConfig({
  entry: [
    // Write your entries here.
  ],
  plugins: [
    ZodPlugin({
      // Write your options here.
    })
  ]
});
