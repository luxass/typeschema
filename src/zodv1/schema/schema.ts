import ts from 'typescript';

import { ZodProperty } from '../../types';

const factory = ts.factory;

type ZodTags =
  | 'enum'
  | 'nativeEnum'
  | 'string'
  | 'boolean'
  | 'undefined'
  | 'number'
  | 'any'
  | 'bigint'
  | 'void'
  | 'never'
  | 'unknown'
  | 'object'
  | 'record';

export function createSchema(
  zodTag: ZodTags,
  args?: ts.Expression[],
  properties?: ZodProperty[]
): ts.CallExpression {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier('z'),
      factory.createIdentifier(zodTag)
    ),
    undefined,
    args
  );
}
