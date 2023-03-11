import type { TypeSchemaPlugin } from "typeschema/plugin";

const ZodSchemaPlugin: TypeSchemaPlugin = {
  name: "zod-schema",
  hooks: {
    config: (ctx) => {
      // Override the entry point
      ctx.config.entry = ["src/index.ts"];
    }
  }
};

export default ZodSchemaPlugin;
