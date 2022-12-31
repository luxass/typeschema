import type { TypeSchemaConfig, TypeSchemaTree } from "@typeschema/types";

export interface TypeSchemaResult {
  ast: TypeSchemaTree
}

export async function createTypeSchema(_config: TypeSchemaConfig): Promise<TypeSchemaResult> {
  const ast = {};
  return {
    ast
  };
}
