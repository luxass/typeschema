import path from 'node:path';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { info } from '../log';
import { parseTypeScript } from '../parser';
import { traverse } from '../traverse';
import {
  JSONSchema,
  JSONSchemaConfig,
  TypeSchemaNodeV1,
  TypeSchemaParser,
  ZodConfig
} from '../types';
import { getGlobby } from '../utils';
import { writeZodSchema } from './writer';

export async function buildZodSchema(config: ZodConfig): Promise<string> {
  let tsconfig: ts.CompilerOptions;
  if (typeof config.tsconfig === 'string') {
    tsconfig = ts.parseJsonConfigFileContent(
      loadTSConfig().compilerOptions,
      ts.sys,
      path.resolve(path.dirname(config.tsconfig))
    ).options;
  } else {
    tsconfig = config.tsconfig || DEFAULT_TSCONFIG.compilerOptions;
  }

  if (!config.input.length) {
    throw new Error('No input files');
  }

  const inputFiles = await getGlobby(config.input);

  const program = ts.createProgram({
    rootNames: inputFiles,
    options: tsconfig
  });
  const rootFileNames = program.getRootFileNames();

  const rootSourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));

  const rootNodes = new Map<string, ts.NodeWithSourceFile>();

  for (const sourceFile of rootSourceFiles) {
    traverse({
      node: sourceFile,
      rootNodes,
      sourceFile,
      jsDocOptions: config.jsdoc || {}
    });
  }

  const nodes = Array.from(rootNodes.values());
  const trees = parseTypeScript(program, nodes);
  console.log(JSON.stringify(trees, null, 2));

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });
  const printSourceFile = ts.createSourceFile('typeschema-zod.ts', '', ts.ScriptTarget.Latest);
  const print = (node: ts.Node) =>
    printer.printNode(ts.EmitHint.Unspecified, node, printSourceFile);

  const bannerText = ts.factory.createJSDocComment(
    config.bannerText || 'Generated by TypeSchema',
    []
  );

  const schemas = writeZodSchema(trees);

  return `${print(bannerText)}\nimport { z } from 'zod';\n\n//third part imports\n\n${schemas.map((schema) => print(schema)).join('\n\n')}`;
}