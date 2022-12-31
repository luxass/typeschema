import type ts from "typescript";

export interface TypeSchemaPlugin {
  name: string
  setup(ctx: PluginContext): void | Promise<void>
}

export interface PluginContext {
  typeChecker: ts.TypeChecker
  ast: AstContext
  transform: TransformContext
}

// Types to AST
export interface AstContext {

}

// AST TO Code
export interface TransformContext {

}
