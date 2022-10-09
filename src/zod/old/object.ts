import ts from 'typescript';

import { Metadata } from '../../types';
import { buildPrimitive } from "./primitive";
import { buildProperties } from './properties';
import { buildExtendedSchema, buildSchema } from './schema';

const factory = ts.factory;

export function buildObject(
  typeNode: ts.TypeLiteralNode | ts.InterfaceDeclaration,
  metadata: Metadata
): ts.CallExpression {
  const { properties, indexSignature } = typeNode.members.reduce<{
    properties: ts.PropertySignature[];
    indexSignature?: ts.IndexSignatureDeclaration;
  }>(
    (mem, member) => {
      if (ts.isIndexSignatureDeclaration(member)) {
        return {
          ...mem,
          indexSignature: member
        };
      }
      if (ts.isPropertySignature(member)) {
        return {
          ...mem,
          properties: [...mem.properties, member]
        };
      }
      return mem;
    },
    { properties: [] }
  );

  let objectSchema: ts.CallExpression | undefined;

  if (properties.length > 0) {
    const parsedProperties = buildProperties(properties, metadata);

    if (metadata.heritageClauses && metadata.heritageClauses.length > 0) {
      objectSchema = buildExtendedSchema(metadata.heritageClauses, [
        factory.createObjectLiteralExpression(
          Array.from(parsedProperties.entries()).map(([key, tsCall]) => {
            return factory.createPropertyAssignment(key, tsCall);
          }),
          true
        )
      ]);
    } else {
      objectSchema = buildSchema('object', [
        factory.createObjectLiteralExpression(
          Array.from(parsedProperties.entries()).map(([key, tsCall]) => {
            return factory.createPropertyAssignment(key, tsCall);
          }),
          true
        )
      ]);
    }
  }

  if (indexSignature) {
    if (metadata.heritageClauses) {
      throw new Error('interface with `extends` and index signature are not supported!');
    }
    const indexSignatureSchema = buildSchema('record', [
      // Index signature type can't be optional or have validators.
      buildPrimitive(indexSignature.type, {
        ...metadata,
        isOptional: false,
        tags: []
      })
    ]);

    if (objectSchema) {
      return factory.createCallExpression(
        factory.createPropertyAccessExpression(indexSignatureSchema, factory.createIdentifier('and')),
        undefined,
        [objectSchema]
      );
    }
    return indexSignatureSchema;
  } else if (objectSchema) {
    return objectSchema;
  }
  return buildSchema('object', [factory.createObjectLiteralExpression()]);
}
