import ts from 'typescript';

import { Metadata } from '../../types';
import { camelize, getPropertiesFromTags } from '../../utils';
import { buildObject } from './object';
import { ZodProperty, withProperties } from './properties';
import { buildSchema, buildSchemaReference } from './schema';

const factory = ts.factory;

function isNotNull(node: ts.TypeNode) {
  return !ts.isLiteralTypeNode(node) || node.literal.kind !== ts.SyntaxKind.NullKeyword;
}

export function buildPrimitive(
  typeNode: ts.TypeNode,
  metadata: Metadata
): ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression {
  console.log('̈́WERWERWERWERWE', ts.SyntaxKind[typeNode.kind]);

  const zodProperties: ZodProperty[] = getPropertiesFromTags(metadata.tags || [], metadata);

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return buildPrimitive(typeNode.type, metadata);
  }

  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    const identifierName = typeNode.typeName.text;

    // Deal with `Array<>` syntax
    if (identifierName === 'Array' && typeNode.typeArguments) {
      return buildPrimitive(factory.createArrayTypeNode(typeNode.typeArguments[0]), metadata);
    }

    // Deal with `Partial<>` syntax
    if (identifierName === 'Partial' && typeNode.typeArguments) {
      return buildPrimitive(typeNode.typeArguments[0], metadata);
    }

    // Deal with `Required<>` syntax
    if (identifierName === 'Required' && typeNode.typeArguments) {
      return buildPrimitive(typeNode.typeArguments[0], metadata);
    }

    // Deal with `Readonly<>` syntax
    if (identifierName === 'Readonly' && typeNode.typeArguments) {
      return buildPrimitive(typeNode.typeArguments[0], metadata);
    }

    // Deal with `ReadonlyArray<>` syntax
    if (identifierName === 'ReadonlyArray' && typeNode.typeArguments) {
      return buildSchema(
        'array',
        [buildPrimitive(typeNode.typeArguments[0], metadata)],
        zodProperties
      );
    }

    // Deal with `Record<>` syntax
    if (identifierName === 'Record' && typeNode.typeArguments) {
      if (
        typeNode.typeArguments.length !== 2 ||
        typeNode.typeArguments[0].kind !== ts.SyntaxKind.StringKeyword
      ) {
        throw new Error(
          `Record<${typeNode.typeArguments[0].getText(
            metadata.sourceFile
          )}, …> are not supported (https://github.com/colinhacks/zod/tree/v3#records)`
        );
      }
      return buildSchema(
        'record',
        [buildPrimitive(typeNode.typeArguments[1], metadata)],
        zodProperties
      );
    }

    // Deal with `Date`
    if (identifierName === 'Date') {
      return buildSchema('date', [], zodProperties);
    }

    // Deal with `Set<>` syntax
    if (identifierName === 'Set' && typeNode.typeArguments) {
      return buildSchema(
        'set',
        typeNode.typeArguments.map((i) => buildPrimitive(i, metadata)),
        zodProperties
      );
    }

    // Deal with `Promise<>` syntax
    if (identifierName === 'Promise' && typeNode.typeArguments) {
      return buildSchema(
        'promise',
        typeNode.typeArguments.map((i) => buildPrimitive(i, metadata)),
        zodProperties
      );
    }

    // Deal with `Omit<>` & `Pick<>` syntax
    if (['Omit', 'Pick'].includes(identifierName) && typeNode.typeArguments) {
      const [originalType, keys] = typeNode.typeArguments;
      let parameters: ts.ObjectLiteralExpression | undefined;

      if (ts.isLiteralTypeNode(keys)) {
        parameters = factory.createObjectLiteralExpression([
          factory.createPropertyAssignment(
            keys.literal.getText(metadata.sourceFile),
            factory.createTrue()
          )
        ]);
      }
      if (ts.isUnionTypeNode(keys)) {
        parameters = factory.createObjectLiteralExpression(
          keys.types.map((type) => {
            if (!ts.isLiteralTypeNode(type)) {
              throw new Error(
                `${identifierName}<T, K> unknown syntax: (${
                  ts.SyntaxKind[type.kind]
                } as K union part not supported)`
              );
            }
            return factory.createPropertyAssignment(
              type.literal.getText(metadata.sourceFile),
              factory.createTrue()
            );
          })
        );
      }

      if (!parameters) {
        throw new Error(
          `${identifierName}<T, K> unknown syntax: (${ts.SyntaxKind[keys.kind]} as K not supported)`
        );
      }

      return factory.createCallExpression(
        factory.createPropertyAccessExpression(
          buildPrimitive(originalType, metadata),
          factory.createIdentifier(identifierName.toLowerCase())
        ),
        undefined,
        [parameters]
      );
    }

    // const dependencyName = getDependencyName(identifierName);
    // dependencies.push(dependencyName);
    const zodSchema: ts.Identifier | ts.CallExpression = factory.createIdentifier(
      camelize(identifierName) + 'Schema'
    );
    return withProperties(zodSchema, zodProperties);
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const hasNull = Boolean(
      typeNode.types.find(
        (i) => ts.isLiteralTypeNode(i) && i.literal.kind === ts.SyntaxKind.NullKeyword
      )
    );

    const nodes = typeNode.types.filter(isNotNull);

    // type A = | 'b' is a valid typescript definition
    // Zod does not allow `z.union(['b']), so we have to return just the value
    if (nodes.length === 1) {
      return buildPrimitive(nodes[0], metadata);
    }

    const values = nodes.map((i) => buildPrimitive(i, metadata));

    // Handling null value outside of the union type
    if (hasNull) {
      zodProperties.push({
        identifier: 'nullable'
      });
    }

    return buildSchema('union', [factory.createArrayLiteralExpression(values)], zodProperties);
  }

  if (ts.isTupleTypeNode(typeNode)) {
    const values = typeNode.elements.map((i) =>
      buildPrimitive(ts.isNamedTupleMember(i) ? i.type : i, metadata)
    );
    return buildSchema('tuple', [factory.createArrayLiteralExpression(values)], zodProperties);
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return buildSchema(
        'literal',
        [factory.createStringLiteral(typeNode.literal.text)],
        zodProperties
      );
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return buildSchema(
        'literal',
        [factory.createNumericLiteral(typeNode.literal.text)],
        zodProperties
      );
    }
    if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return buildSchema('literal', [factory.createTrue()], zodProperties);
    }
    if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return buildSchema('literal', [factory.createFalse()], zodProperties);
    }
  }

  // Deal with enums used as literals
  if (
    ts.isTypeReferenceNode(typeNode) &&
    ts.isQualifiedName(typeNode.typeName) &&
    ts.isIdentifier(typeNode.typeName.left)
  ) {
    return buildSchema(
      'literal',
      [factory.createPropertyAccessExpression(typeNode.typeName.left, typeNode.typeName.right)],
      zodProperties
    );
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return buildSchema('array', [buildPrimitive(typeNode.elementType, metadata)], zodProperties);
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return withProperties(buildObject(typeNode, metadata), zodProperties);
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    const [base, ...rest] = typeNode.types;
    const basePrimitive = buildPrimitive(base, metadata);

    return rest.reduce(
      (intersectionSchema, node) =>
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            intersectionSchema,
            factory.createIdentifier('letsgo')
          ),
          undefined,
          [buildPrimitive(node, metadata)]
        ),
      basePrimitive
    );
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    return buildSchema(typeNode.literal.getText(metadata.sourceFile), [], zodProperties);
  }

  if (ts.isFunctionTypeNode(typeNode)) {
    return buildSchema(
      'function',
      [],
      [
        {
          identifier: 'args',
          expressions: typeNode.parameters.map((p) =>
            buildPrimitive(
              p.type || factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              metadata
            )
          )
        },
        {
          identifier: 'returns',
          expressions: [buildPrimitive(typeNode.type, metadata)]
        },
        ...zodProperties
      ]
    );
  }

  if (ts.isIndexedAccessTypeNode(typeNode)) {
    return buildSchemaReference(typeNode, {
      dependencies: metadata.dependencies,
      sourceFile: metadata.sourceFile
    });
  }

  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return buildSchema('string', [], zodProperties);
    case ts.SyntaxKind.BooleanKeyword:
      return buildSchema('boolean', [], zodProperties);
    case ts.SyntaxKind.UndefinedKeyword:
      return buildSchema('undefined', [], zodProperties);
    case ts.SyntaxKind.NumberKeyword:
      return buildSchema('number', [], zodProperties);
    case ts.SyntaxKind.AnyKeyword:
      return buildSchema('any', [], zodProperties);
    case ts.SyntaxKind.BigIntKeyword:
      return buildSchema('bigint', [], zodProperties);
    case ts.SyntaxKind.VoidKeyword:
      return buildSchema('void', [], zodProperties);
    case ts.SyntaxKind.NeverKeyword:
      return buildSchema('never', [], zodProperties);
    case ts.SyntaxKind.UnknownKeyword:
      return buildSchema('unknown', [], zodProperties);
  }

  console.warn(
    ` »   Warning: '${ts.SyntaxKind[typeNode.kind]}' is not supported, fallback into 'z.any()'`
  );
  return buildSchema('any', [], zodProperties);
}
