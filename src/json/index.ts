import { globby } from 'globby';
import path from 'node:path';
import { parentPort } from 'node:worker_threads';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { log } from "../log";
import { traverse } from '../traverse';
import { JSONConfig, JSONSchema, TypeSchemaNode } from '../types';

export async function createJSONSchema(config: JSONConfig): Promise<JSONSchema> {
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

  const rootNodes = new Map<string, TypeSchemaNode>();

  for (const sourceFile of rootSourceFiles) {
    traverse({
      node: sourceFile,
      rootNodes,
      sourceFile,
      jsDocOptions: config.jsdoc || {}
    });
  }

  const definitions = {};
  
  Array.from(rootNodes.values()).forEach((node) => {
    log('json', node.node.name.escapedText);
  });

  const jsonSchema: JSONSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions
  };

  if (config.id) {
    jsonSchema.$id = config.id;
  }

  return jsonSchema;
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
