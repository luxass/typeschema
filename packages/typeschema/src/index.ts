import type { TypeSchemaConfig, TypeSchemaTree } from "@typeschema/types";
export { defineConfig } from "@typeschema/utils-internal";

export interface TypeSchemaResult {
  ast: TypeSchemaTree
}

export async function createTypeSchema(config: TypeSchemaConfig): Promise<TypeSchemaResult> {
  const ast = {};
  return {
    ast
  };
}
