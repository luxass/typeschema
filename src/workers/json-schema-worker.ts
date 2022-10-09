import { parentPort } from 'node:worker_threads';

import { buildJSONSchema } from '../jsonschema/jsonschema';
import { JSONSchemaConfig } from '../types';

async function startJSONSchema(config: JSONSchemaConfig) {
  try {
    const schema = await buildJSONSchema(config);
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

parentPort?.on('message', (data: JSONSchemaConfig) => {
  startJSONSchema(data);
});
