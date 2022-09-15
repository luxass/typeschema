import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

import { TypeSchemaConfig } from './types';

export * from './zod';

export async function createTypeSchema(config: TypeSchemaConfig) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tasks: (() => Promise<void>)[] = [];

  if (config.zod) {
    const zodTask = async () => {
      await new Promise<void>((resolve, reject) => {
        console.log('Creating Zod schema...');

        const worker = new Worker(path.join(__dirname, './zod/index.js'));
        worker.postMessage({
          ...config.zod
        });

        worker.on('message', (data) => {
          if (data === 'error') {
            reject(new Error('error occured while creating Zod schema'));
          } else if (data === 'success') {
            resolve();
          }
        });
      });
    };
    tasks.push(zodTask);
  }

  if (config.json) {
    const jsonTask = async () => {};
    tasks.push(jsonTask);
  }
  await Promise.all(tasks.map((task) => task()));
}
