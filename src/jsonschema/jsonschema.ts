import { globby } from 'globby';
import path from 'node:path';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { info } from '../log';
import { traverse } from '../traverse';
import { JSONSchemaConfig, TypeSchemaNode, TypeSchemaParser } from '../types';

export async function buildJSONSchema(config: JSONSchemaConfig): Promise<TypeSchemaParser> {
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
    info('json', node.node.name.escapedText);
  });

  
  return {
    parse: () => {
      return {
        type: 'object',
        properties: {}
      };
    }
  };
}
