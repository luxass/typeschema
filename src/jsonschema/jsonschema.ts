import { writeFile } from "node:fs/promises";
import path from 'node:path';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { info } from '../log';
import { parseTypeScript } from '../parser';
import { traverse } from '../traverse';
import { JSONSchema, JSONSchemaConfig, TypeSchemaNodeV1, TypeSchemaParser } from '../types';
import { getGlobby } from '../utils';
import { writeJSONSchema } from "./writer";

export async function buildJSONSchema(config: JSONSchemaConfig): Promise<JSONSchema> {
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
    options: tsconfig,
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

  // console.log('SCHEMA', JSON.stringify(trees, null, 2));
  await writeFile('.out/trees.json', JSON.stringify(trees, null, 2));
  const definitions = writeJSONSchema(trees);

  const topLevelRef = trees.find((tree) => tree.annotations?.find((annotation) => annotation.tagName === 'jsonschema-ref'))?.name;

  const jsonSchema: JSONSchema = {
    ...(config.id ? { $id: config.id } : {}),
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...(topLevelRef ? { $ref: `#/definitions/${topLevelRef}` } : {}),
    definitions
  };

  return jsonSchema;
}
