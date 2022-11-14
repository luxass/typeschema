import { parentPort } from 'node:worker_threads';

import { TypeSchemaTree, ZodConfig } from '../types';
import { buildZodSchema } from '../zod';

// import { createZodSchema } from '../zodv1';

async function startZodSchema(trees: TypeSchemaTree[]) {
  try {
    const schema = await buildZodSchema(trees);
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

parentPort?.on('message', (data: TypeSchemaTree[]) => {
  startZodSchema(data);
});
