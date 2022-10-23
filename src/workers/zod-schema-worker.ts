import { parentPort } from 'node:worker_threads';

import { ZodConfig } from '../types';
import { buildZodSchema } from "../zod";
// import { createZodSchema } from '../zodv1';

async function startZodSchema(config: ZodConfig) {
  try {
    const schema = await buildZodSchema(config);
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

parentPort?.on('message', (data: ZodConfig) => {
  startZodSchema(data);
});
