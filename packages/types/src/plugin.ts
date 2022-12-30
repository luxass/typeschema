import type ts from "typescript";

export interface TypeSchemaPlugin {
  name: string
  setup(ctx: PluginContext): void | Promise<void>
}

export interface PluginContext {
  typeChecker: ts.TypeChecker
  // register(kind: ts.SyntaxKind, parser: (node: ts.Node) => TypeSchemaTree): void;
}
