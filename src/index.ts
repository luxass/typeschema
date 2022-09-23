import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import { info } from "./log";

import { TypeSchemaConfig } from './types';
import { writeFile } from './utils';

export { JSONConfig, JSDocOptions, ZodConfig, TypeSchemaConfig } from './types';

export * from './zod';
export * from './json';

export async function createTypeSchema(config: TypeSchemaConfig) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tasks: (() => Promise<void>)[] = [];

  if (config.zod) {
    const zodTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('zod', 'Creating Zod schema...');

        const worker = new Worker(path.join(__dirname, './zod/index.js'));
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

  if (config.json) {
    const jsonTask = async () => {
      await new Promise<void>((resolve, reject) => {
        info('json', 'Creating JSON schema...');

        const worker = new Worker(path.join(__dirname, './json/index.js'));
        worker.postMessage({
          ...config.json
        });

        worker.on('message', (data: { type: 'error' | 'success'; data: string }) => {
          if (data.type === 'error') {
            reject(new Error(data.data));
          } else if (data.type === 'success') {
            resolve(
              writeFile(
                path.join(config.json!.outputDir, 'typeschema.json'),
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
