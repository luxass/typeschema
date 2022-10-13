import ts from 'typescript';

export interface TypeSchemaConfig {
  zod?: ZodConfig;
  jsonschema?: JSONSchemaConfig;
}

export interface PrettiedTags {
  tagName: string;
  comment?: string | ts.NodeArray<ts.JSDocComment>;
}

export interface JSDocOptions {
  /**
   * Filter types by tag.
   */
  include?: string;

  /**
   * Use Tags for validation
   */
  useTags?: boolean;
}

export interface ZodConfig {
  /**
   * Path to input files.
   */
  input: string[];

  /**
   * Path to output directory.
   */
  outputDir: string;

  /**
   * Include exports in the output.
   */
  includeExports?: boolean;

  /**
   * JSDoc options.
   */
  jsdoc?: JSDocOptions;

  /**
   * TypeScript options.
   */
  tsconfig?: string | ts.CompilerOptions;

  /**
   * Add a banner for generated files.
   * @default 'Generated by TypeSchema'
   */
  bannerText?: string;
}

export interface JSONSchemaConfig {
  /**
   * Path to input files.
   */
  input: string[];

  /**
   * Path to output directory.
   */
  outputDir: string;

  /**
   * Include exports in the output.
   */
  includeExports?: boolean;

  /**
   * JSDoc options.
   */
  jsdoc?: JSDocOptions;

  /**
   * TypeScript options.
   */
  tsconfig?: string | ts.CompilerOptions;

  /**
   * Id of the schema.
   */
  id?: string;
}

export interface Metadata {
  isOptional?: boolean;
  dependencies: string[];
  tags?: PrettiedTags[];
  heritageClauses?: string[];
  useTags?: boolean;
  sourceFile: ts.SourceFile;
}

export interface TypeSchemaNode {
  node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration;
  sourceFile: ts.SourceFile;
}

export interface ZodProperty {
  identifier: string;
  expressions?: ts.Expression[];
}

export type JSONSchemaPrimitiveName =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

export type JSONSchemaPrimitive =
  | string
  | number
  | boolean
  | JSONSchemaObject
  | JSONSchemaArray
  | null;

export interface JSONSchemaObject {
  [key: string]: JSONSchemaPrimitive;
}

export interface JSONSchemaArray extends Array<JSONSchemaPrimitive> {}

export type JSONSchemaDefinition = JSONSchema | boolean;

export interface JSONSchema {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;
  $defs?: {
    [key: string]: JSONSchemaDefinition;
  };
  type?: JSONSchemaPrimitiveName | JSONSchemaPrimitiveName[];
  enum?: JSONSchemaPrimitive[];
  const?: JSONSchemaPrimitive;

  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  maxLength?: number;
  minLength?: number;
  pattern?: string;

  items?: JSONSchemaDefinition | JSONSchemaDefinition[];
  additionalItems?: JSONSchemaDefinition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema;

  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  properties?: {
    [key: string]: JSONSchemaDefinition;
  };
  patternProperties?: {
    [key: string]: JSONSchemaDefinition;
  };
  additionalProperties?: JSONSchemaDefinition;
  dependencies?: {
    [key: string]: JSONSchemaDefinition | string[];
  };
  propertyNames?: JSONSchemaDefinition;

  if?: JSONSchemaDefinition;
  then?: JSONSchemaDefinition;
  else?: JSONSchemaDefinition;

  allOf?: JSONSchemaDefinition[];
  anyOf?: JSONSchemaDefinition[];
  oneOf?: JSONSchemaDefinition[];
  not?: JSONSchemaDefinition;

  format?: string;

  contentMediaType?: string;
  contentEncoding?: string;

  definitions?: {
    [key: string]: JSONSchemaDefinition;
  };

  title?: string;
  description?: string;
  default?: JSONSchemaPrimitive;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: JSONSchemaPrimitive;
}

export interface TypeSchemaParser {}

export interface TypeSchemaNodeV2 {}
