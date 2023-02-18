import { defineConfig } from "typeschema/config";
import { JSONPlugin } from "@typeschema/json-plugin"

export default defineConfig({
  entry: [
    // Write your entries here.
  ],
  plugins: [
    JSONPlugin({
      // Write your options here.
    })
  ]
});
