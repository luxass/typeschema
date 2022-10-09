import ts from 'typescript';
import { warn } from "../../log";

import { Metadata, ZodProperty } from '../../types';
import { camelize, getPropertiesFromTags } from '../../utils';
import { createSchema } from './schema';

export function getPrimitive(
  node: ts.TypeNode,
  metadata: Metadata
): ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression {
  const zodProperties: ZodProperty[] = getPropertiesFromTags(metadata.tags || [], metadata);

  



  switch (node.kind) {
    case ts.SyntaxKind.StringKeyword:
      return createSchema('string', [], zodProperties);
    case ts.SyntaxKind.BooleanKeyword:
      return createSchema('boolean', [], zodProperties);
    case ts.SyntaxKind.UndefinedKeyword:
      return createSchema('undefined', [], zodProperties);
    case ts.SyntaxKind.NumberKeyword:
      return createSchema('number', [], zodProperties);
    case ts.SyntaxKind.AnyKeyword:
      return createSchema('any', [], zodProperties);
    case ts.SyntaxKind.BigIntKeyword:
      return createSchema('bigint', [], zodProperties);
    case ts.SyntaxKind.VoidKeyword:
      return createSchema('void', [], zodProperties);
    case ts.SyntaxKind.NeverKeyword:
      return createSchema('never', [], zodProperties);
    case ts.SyntaxKind.UnknownKeyword:
      return createSchema('unknown', [], zodProperties);
  }

  warn('unsupported', `'${ts.SyntaxKind[node.kind]}' is not supported, fallback into 'z.any()'`)
  return createSchema('any', [], zodProperties);
}
