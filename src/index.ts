import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

import { info } from './log';
import { TypeSchemaConfig } from './types';
import { writeFile } from './utils';

export { JSONSchemaConfig, JSDocOptions, ZodConfig, TypeSchemaConfig } from './types';

export * from './zod';
export * from './json';
export * from './jsonschema';

export async function createTypeSchema(config: TypeSchemaConfig) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tasks: (() => Promise<void>)[] = [];

  if (config.zod) {
    const zodTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('zod', 'Creating Zod schema...');

        const worker = new Worker(path.join(__dirname, './workers/zod-schema-worker.js'));
        worker.postMessage({
          ...config.zod
        });

        worker.on('message', (data: { type: 'error' | 'success'; data: string }) => {
          if (data.type === 'error') {
            reject(new Error(data.data));
          } else if (data.type === 'success') {
            resolve(writeFile(path.join(config.zod!.outputDir, 'typeschema.ts'), data.data));
          }
        });
      });
    };
    tasks.push(zodTask);
  }

  if (config.jsonschema) {
    const jsonTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('json', 'Creating JSON schema...');

        const worker = new Worker(path.join(__dirname, './workers/json-schema-worker.js'));
        worker.postMessage({
          ...config.jsonschema
        });

        worker.on('message', (data: { type: 'error' | 'success'; data: string }) => {
          if (data.type === 'error') {
            reject(new Error(data.data));
          } else if (data.type === 'success') {
            resolve(
              writeFile(
                path.join(config.jsonschema!.outputDir, 'typeschema.json'),
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
