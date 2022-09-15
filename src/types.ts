export interface CreateZodSchemaOptions {}

export interface JSDocOptions {}

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
  tsconfig?: string;
}

export interface JSONConfig {
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
  tsconfig?: string;
}

export interface TypeSchemaConfig {
  zod?: ZodConfig;
  json?: JSONConfig;
}
