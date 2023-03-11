import type { TypeSchemaConfig, TypeSchemaContext } from "./@types/typeschema";
import type { TypeSchemaTree } from "./ast/tree";
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

  await ctx.hooks.call("config", {
    config,
    mode: "build"
  });

  const ast = {};

  return {
    ast
  };
}
