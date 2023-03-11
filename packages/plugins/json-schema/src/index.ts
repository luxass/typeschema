import type { TypeSchemaPlugin } from "typeschema/plugin";

const JsonSchemaPlugin: TypeSchemaPlugin = {
  name: "json-schema",
  hooks: {
    config: (ctx) => {
      // Override the entry point
      ctx.config.entry = ["src/index.ts"];
    }
  }
};

export default JsonSchemaPlugin;
