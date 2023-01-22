import { resolveTSConfig } from "tsconf-utils";
import ts from "typescript";

import { resolveConfig } from "@luxass/find-config";
import { loadConfig } from "@luxass/load-config";
import type { TypeSchemaConfig } from "@typeschema/types";

export async function loadTypeSchemaConfig(
  cwd: string,
  configFile?: string
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> {
  const resolvedConfig = await resolveConfig({
    files: configFile
      ? [configFile]
      : [
          "typeschema.config.ts",
          "typeschema.config.js",
          "typeschema.config.cjs",
          "typeschema.config.mjs",
          "typeschema.json",
          "package.json"
        ],
    cwd,
    name: "typeschema"
  });
  if (!resolvedConfig) return {};

  const { config } = await loadConfig(resolvedConfig.path, {
    cwd
  });

  console.log(config);

  return {};
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

export const defineConfig = (config: TypeSchemaConfig) => config;
