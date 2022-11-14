import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from './config';
import { info } from './log';
import { parseTypes } from './parser';
import { PluginContainer } from './plugin-container';
import { traverse } from './traverse';
import { TypeSchemaConfig } from './types';
import { getGlobby, writeFile } from './utils';

export * from './jsonschema';
export type {
  JSDocOptions,
  JSONSchemaConfig,
  PluginContext,
  TypeSchemaConfig,
  TypeSchemaPlugin,
  ZodConfig
} from './types';
export * from './zod';

export async function runTypeSchema(config: TypeSchemaConfig) {
  const { plugins, jsdoc, tsconfig: _tsconfig, jsonschema, zod } = config;

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tasks: (() => Promise<void>)[] = [];

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

  const files = [...new Set([...(jsonschema?.input || []), ...(zod?.input || [])])];

  if (!files.length) {
    throw new Error('No input files');
  }

  const inputFiles = await getGlobby(files);

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
      jsDocOptions: jsdoc || {}
    });
  }

  const nodes = Array.from(rootNodes.values());

  const pluginContainer = new PluginContainer(plugins || []);
  const trees = await parseTypes(program, nodes, pluginContainer);

  if (zod) {
    const zodTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('zod', 'Creating Zod schema...');

        const worker = new Worker(path.join(__dirname, './workers/zod-schema-worker.js'));
        worker.postMessage(trees);

        worker.on('message', (data: { type: 'error' | 'success'; data: string }) => {
          if (data.type === 'error') {
            reject(new Error(data.data));
          } else if (data.type === 'success') {
            resolve(writeFile(path.join(zod.outputDir, 'typeschema.ts'), data.data));
          }
        });
      });
    };
    tasks.push(zodTask);
  }

  if (jsonschema) {
    const jsonTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('json', 'Creating JSON schema...');

        const worker = new Worker(path.join(__dirname, './workers/json-schema-worker.js'));
        worker.postMessage(trees);

        worker.on('message', (data: { type: 'error' | 'success'; data: string }) => {
          if (data.type === 'error') {
            reject(new Error(data.data));
          } else if (data.type === 'success') {
            resolve(
              writeFile(
                path.join(jsonschema.outputDir, 'typeschema.json'),
                JSON.stringify(data.data, null, 2)
              )
            );
          }
        });
      });
    };
    tasks.push(jsonTask);
  }
  await Promise.all(tasks.map((task) => task()));
}
