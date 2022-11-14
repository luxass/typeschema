import { parentPort } from 'node:worker_threads';

import { buildJSONSchema } from '../jsonschema/jsonschema';
import { JSONSchemaConfig, TypeSchemaTree } from '../types';

async function startJSONSchema(trees: TypeSchemaTree[]) {
  try {
    const schema = await buildJSONSchema(trees);
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
  startJSONSchema(data);
});
