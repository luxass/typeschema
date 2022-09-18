import { globby } from 'globby';
import path from 'node:path';
import { parentPort } from 'node:worker_threads';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { traverse } from '../traverse';
import { JSONConfig, TypeSchemaNode } from '../types';
import { getZodSchema } from "../zod/schema";

interface Schema {
  name: string;
  schema: {
    dependencies: string[];
    schema: ts.VariableStatement;
  };
}

export async function createJSONSchema(config: JSONConfig): Promise<string> {
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

  const inputFiles = await globby(config.input, {
    absolute: true
  });

  const program = ts.createProgram({
    rootNames: inputFiles,
    options: tsconfig
  });
  const rootFileNames = program.getRootFileNames();

  const rootSourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));

  const rootNodes = new Map<
    string,
    TypeSchemaNode
  >();

  for (const sourceFile of rootSourceFiles) {
    traverse({
      node: sourceFile,
      rootNodes,
      sourceFile,
      jsDocOptions: config.jsdoc || {}
    });
  }

  const schemas: Schema[] = [...rootNodes.values()].map((schemaNode) => ({
    name: schemaNode.node.name.text,
    schema: getZodSchema(schemaNode.node, schemaNode.node.name.text, schemaNode.sourceFile, config)
  }));

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });

  const output = schemas.map((schema) => {
    return printer.printNode(
      ts.EmitHint.Unspecified,
      schema.schema.schema,
      ts.createSourceFile('typeschema.ts', '', ts.ScriptTarget.Latest)
    );
  });

  return output.join('\n\n');
}

async function startJSONSchema(config: JSONConfig) {
  try {
    const schema = await createJSONSchema(config);
    parentPort?.postMessage({
      type: 'success',
      data: schema
    });
  } catch (error) {
    parentPort?.postMessage({
      type: 'error',
      data: error.message
    });
  }
  parentPort?.close();
}

parentPort?.on('message', (data: JSONConfig) => {
  startJSONSchema(data);
});