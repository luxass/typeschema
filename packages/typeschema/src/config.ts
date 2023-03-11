import { existsSync, writeFileSync } from "node:fs";

import { resolveTSConfig } from "tsconf-utils";
import ts from "typescript";

import { resolveConfig } from "@luxass/find-config";
import { loadConfig } from "@luxass/load-config";
import type { TypeSchemaConfig } from "./@types/typeschema";

const DEFAULT_CONFIG_FILES: string[] = [
  "typeschema.config.ts",
  "typeschema.config.js",
  "typeschema.config.cjs",
  "typeschema.config.mjs",
  "typeschema.config",
  "typeschema.json",
  "package.json"
];

const DEFAULT_CONFIG: TypeSchemaConfig = {
  entry: ["src/index.ts"]
};

export async function loadTypeSchemaConfig(
  cwd: string,
  configFile?: string
): Promise<ReturnType<typeof defineTypeSchemaConfig>> {
  const resolvedConfig = await resolveConfig({
    files: configFile ? [configFile] : DEFAULT_CONFIG_FILES,
    cwd,
    name: "typeschema"
  });

  if (!resolvedConfig) {
    throw new Error(
      "Could not find config file, run `typeschema init` to create one."
    );
  }

  const { config } = await loadConfig(resolvedConfig.path, {
    cwd
  });

  return config;
}

export const DEFAULT_TSCONFIG: { compilerOptions: ts.CompilerOptions } = {
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext
  }
};

export async function loadTSConfig(): Promise<{
  compilerOptions: ts.CompilerOptions;
}> {
  const tsconfigResult = await resolveTSConfig(process.cwd());
  if (tsconfigResult?.tsconfig) {
    const tsconfig = tsconfigResult.tsconfig;
    const parsed = tsconfig.data;
    delete parsed.compilerOptions.outDir;
    delete parsed.compilerOptions.outFile;
    delete parsed.compilerOptions.declaration;
    delete parsed.compilerOptions.declarationDir;
    delete parsed.compilerOptions.declarationMap;
    return parsed;
  } else {
    return DEFAULT_TSCONFIG;
  }
}

export function initializeConfig() {
  if (existsSync("typeschema.config.ts")) {
    console.log("typeschema.config.ts already exists");
    return;
  }

  const content = `import { defineTypeSchemaConfig } from "typeschema/config";\n\nexport default defineTypeSchemaConfig(${JSON.stringify(
    DEFAULT_CONFIG,
    null,
    2
  )});`;

  writeFileSync("typeschema.config.ts", content);
}

export const defineTypeSchemaConfig = (config: TypeSchemaConfig) => config;
