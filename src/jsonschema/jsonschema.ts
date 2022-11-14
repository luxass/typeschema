import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

import { DEFAULT_TSCONFIG, loadTSConfig } from '../config';
import { info } from '../log';
import { traverse } from '../traverse';
import {
  JSONSchema,
  JSONSchemaConfig,
  TypeSchemaNodeV1,
  TypeSchemaParser,
  TypeSchemaTree
} from '../types';
import { getGlobby } from '../utils';
import { writeJSONSchema } from './writer';

export async function buildJSONSchema(trees: TypeSchemaTree[]): Promise<JSONSchema> {
  console.log('SCHEMA', JSON.stringify(trees, null, 2));
  await writeFile('.out/trees.json', JSON.stringify(trees, null, 2));
  const definitions = writeJSONSchema(trees);

  const topLevelRef = trees.find((tree) =>
    tree.annotations?.find((annotation) => annotation.tagName === 'jsonschema-ref')
  )?.name;

  const jsonSchema: JSONSchema = {
    // ...(config.id ? { $id: config.id } : {}),
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...(topLevelRef ? { $ref: `#/definitions/${topLevelRef}` } : {}),
    definitions
  };

  return jsonSchema;
}
