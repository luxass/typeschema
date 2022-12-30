import path from "node:path";
import { bundleRequire, loadTsConfig } from "bundle-require";
import JoyCon from "joycon";
import ts from "typescript";

import { parseFile } from "jsonc-parse";

export interface TypeSchemaConfig {

}

const joycon = new JoyCon();

const jsonLoader = {
  test: /\.json$/,
  load(filepath: string) {
    return parseFile(filepath);
  }
};

joycon.addLoader(jsonLoader);

export async function loadTypeSchemaConfig(
  cwd: string,
  configFile?: string
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> {
  const configPath = await joycon.resolve({
    files: configFile
      ? [configFile]
      : [
          "typeschema.config.ts",
          "typeschema.config.js",
          "typeschema.config.cjs",
          "typeschema.config.mjs",
          "typeschema.config.json",
          "package.json"
        ],
    cwd,
    stopDir: path.parse(cwd).root,
    packageKey: "typeschema"
  });

  if (configPath) {
    if (configPath.endsWith(".json")) {
      let data = await parseFile(configPath);
      if (!data) return {};

      if (configPath.endsWith("package.json")) {
        data = data.typeschema;
      }
      return { path: configPath, data };
    }

    const config = await bundleRequire({
      filepath: configPath
    });
    return {
      path: configPath,
      data: config.mod.typeschema || config.mod.default || config.mod
    };
  }

  return {};
}

export const DEFAULT_TSCONFIG: { compilerOptions: ts.CompilerOptions } = {
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext
  }
};

export function loadTSConfig(): { compilerOptions: ts.CompilerOptions } {
  const tsconfig = loadTsConfig(process.cwd());
  if (tsconfig) {
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
