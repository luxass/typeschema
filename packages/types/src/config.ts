import type ts from "typescript";
import type { TypeSchemaPlugin } from "./plugin";

export interface TypeSchemaConfig {
  plugins?: TypeSchemaPlugin[]
  tsconfig?: string | ts.CompilerOptions
}
