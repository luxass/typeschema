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
): Promise<{
  config: ReturnType<typeof defineTypeSchemaConfig>;
  path: string;
}> {
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

  return { config, path: resolvedConfig.path };
}

export const DEFAULT_TSCONFIG: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext
};

export async function loadTSConfig(cwd: string): Promise<{
  path?: string;
  compilerOptions: ts.CompilerOptions;
}> {
  const tsconfigResult = await resolveTSConfig(cwd);

  if (tsconfigResult?.tsconfig) {
    return {
      compilerOptions: tsconfigResult.tsconfig.compilerOptions,
      path: tsconfigResult.path
    };
  } else {
    return {
      compilerOptions: DEFAULT_TSCONFIG,
      path: undefined
    };
  }
}

export function initializeConfig() {
  if (existsSync("typeschema.config.ts")) {
    console.warn("typeschema.config.ts already exists");
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
