import type { TypeSchemaConfig, TypeSchemaTree } from "@typeschema/types";

import { createHooks } from "./plugins";

export interface TypeSchemaResult {
  ast: TypeSchemaTree;
}



export async function createTypeSchema(
  config: TypeSchemaConfig
): Promise<TypeSchemaResult> {
  const ctx: TypeSchemaContext = {
    config,
    hooks: createHooks(config.plugins)
  };

  if (config.hooks) {
    ctx.hooks.add(config.hooks)
  }

  await ctx.hooks.call("config", {
    config
  });

  const ast = {};

  return {
    ast
  };
}
