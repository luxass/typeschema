import path from "node:path";

import { globby } from "globby";

import { parseFile, print } from "@swc/core";

import type { TypeSchemaContext } from "./@types/typeschema";
import { Traverse } from "./ast/traverse";
import type { TypeSchemaTree } from "./ast/tree";
import { loadTypeSchemaConfig } from "./config";
import { createHooks } from "./plugins";

export interface TypeSchemaResult {
  ast: TypeSchemaTree;
}

export async function createTypeSchema({
  configPath,
  watch
}: {
  configPath?: string;
  watch: boolean;
}): Promise<TypeSchemaResult> {
  const { config, path: resolvedConfigPath } = await loadTypeSchemaConfig(
    process.cwd(),
    configPath
  );

  const ctx: TypeSchemaContext = {
    config,
    hooks: createHooks(config.plugins)
  };

  await ctx.hooks.call("config", {
    config,
    watch
  });

  const inputFiles = await globby(config.entry, {
    absolute: true,
    cwd: path.dirname(resolvedConfigPath)
  });

  console.log(inputFiles);

  for await (const file of inputFiles) {
    const resolvedPath = path.resolve(file);

    const swcAst = await parseFile(resolvedPath, {
      syntax: "typescript",
      comments: true,
      script: true
    });

    const { Visitor } = await import("@swc/core/Visitor.js").then((mod) => mod);

    console.log(Visitor);

    const visitor = new Traverse();

    const visitedModule = visitor.visitModule(swcAst);
    console.log(visitedModule);

    const output = await print(visitedModule, {
      jsc: {
        target: "esnext"
      }
    });

    console.log(output.code);
  }

  // let tsconfig: ts.CompilerOptions = {};
  // if (typeof config.tsconfig === "string" || !config.tsconfig) {
  //   const resolvedConfig = await loadTSConfig(path.dirname(resolvedPath));

  //   console.log(resolvedConfig);
  //   console.log(path.resolve(path.dirname(resolvedPath)));

  //   console.log(
  //     ts.parseJsonConfigFileContent(
  //       resolvedConfig.compilerOptions,
  //       ts.sys,
  //       // path.resolve(path.dirname(resolvedConfig.path || resolvedPath)),
  //       path.resolve(path.dirname(config.tsconfig || resolvedPath))
  //     )
  //   );

  //   tsconfig = ts.parseJsonConfigFileContent(
  //     resolvedConfig.compilerOptions,
  //     ts.sys,
  //     path.dirname(resolvedConfig.path || "")
  //   ).options;

  //   // tsconfig = ts.parseJsonConfigFileContent(
  //   //   (await loadTSConfig(path.dirname(fileURLToPath(import.meta.url))))
  //   //     .compilerOptions,
  //   //   ts.sys,
  //   //   path.resolve(path.dirname(config.tsconfig))
  //   // ).options;
  // } else {
  //   tsconfig = config.tsconfig || DEFAULT_TSCONFIG.compilerOptions;
  // }

  // console.log(tsconfig);

  // const inputFiles = await globby(config.entry, {
  //   absolute: true
  // });

  // console.log("Input files", inputFiles);

  // const program = ts.createProgram({
  //   rootNames: inputFiles,
  //   options: tsconfig
  // });
  // const rootFileNames = program.getRootFileNames();

  // const rootSourceFiles = program
  //   .getSourceFiles()
  //   .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));

  // console.log(rootSourceFiles);

  const ast = {};

  return {
    ast
  };
}
