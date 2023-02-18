import { defineConfig } from "typeschema/config";

import { JSONPlugin } from "@typeschema/json-plugin";
import { ZodPlugin } from "@typeschema/zod-plugin";

export default defineConfig({
  entry: [
    // Write your entries here.
  ],
  plugins: [
    JSONPlugin({
      // Write your options here.
    }),
    ZodPlugin({
      // Write your options here.
    })
  ]
});
