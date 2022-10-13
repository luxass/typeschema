import ts from 'typescript';

import { error } from '../../log';
import { Metadata } from '../../types';
import { getPrettyJSDoc } from '../../utils';
import { buildPrimitive } from '../old/primitive';
import { buildProperties } from '../old/properties';
import { buildExtendedSchema, buildSchema } from '../old/schema';
import { createSchema } from './schema';

const factory = ts.factory;

export function getObject(
  node: ts.TypeLiteralNode | ts.InterfaceDeclaration,
  metadata: Metadata
): ts.CallExpression {
  const { properties, indexSignature } = node.members.reduce<{
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

  if (properties.length) {
    const parsedProperties = parseProperties(properties, metadata);

    if (metadata.heritageClauses) {
      error('Extending interfaces is not supported yet!');
      return null;
    }

    if (indexSignature) {
      error('Extending interfaces is not supported yet!');
      return null;
    }

    return createSchema('object', [
      factory.createObjectLiteralExpression(
        Array.from(parsedProperties.entries()).map(([key, tsCall]) => {
          return factory.createPropertyAssignment(key, tsCall);
        }),
        true
      )
    ]);
  }

  // If no properties, but has a indexSignature
  if (indexSignature) {
    if (metadata.heritageClauses) {
      error('Extending interfaces is not supported yet!');
      return null;
    }

    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        createSchema('object', [factory.createObjectLiteralExpression([], true)]),
        factory.createIdentifier('catchall')
      ),
      undefined,
      [factory.createIdentifier('z.string()')]
    );
  }

  return createSchema('object', [factory.createObjectLiteralExpression([], true)]);
}

// TODO: Just for testing
function parseProperties(
  members: ts.NodeArray<ts.TypeElement> | ts.PropertySignature[],
  metadata: Metadata
) {
  const properties = new Map<
    ts.Identifier | ts.StringLiteral,
    ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression
  >();
  members.forEach((member) => {
    if (
      !ts.isPropertySignature(member) ||
      !member.type ||
      !(ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
    ) {
      return;
    }

    // const isOptional = Boolean(member.questionToken);
    // const jsDocTags = skipParseJSDoc ? {} : getJSDocTags(member, sourceFile);
    const tags = metadata.useTags ? [] : getPrettyJSDoc(member, metadata.sourceFile);

    properties.set(
      member.name,
      buildPrimitive(member.type, {
        tags,
        isOptional: Boolean(member.questionToken),
        sourceFile: metadata.sourceFile,
        dependencies: metadata.dependencies
      })
    );
  });
  return properties;
}
