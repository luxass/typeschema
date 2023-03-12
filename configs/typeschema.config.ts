import { defineTypeSchemaConfig } from "typeschema/config";

export default defineTypeSchemaConfig({
  entry: ["src/index.ts"],
  plugins: [
    {
      name: "my-plugin",
      hooks: {
        config: async (ctx) => {
          ctx.config.entry.push("src/other.ts");
        }
      }
    }
  ],
  tsconfig: "./tsconfig.json"
});
