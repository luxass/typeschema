import ts from 'typescript';

import { Metadata } from '../../types';
import { camelize, findNode } from "../../utils";
import { ZodProperty, withProperties } from './properties';

const factory = ts.factory;

export function buildSchema(
  zodFunction: string,
  args?: ts.Expression[],
  properties?: ZodProperty[]
) {
  return withProperties(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier('z'),
        factory.createIdentifier(zodFunction)
      ),
      undefined,
      args
    ),
    properties
  );
}

export function buildExtendedSchema(
  schemaList: string[],
  args?: ts.Expression[],
  properties?: ZodProperty[]
) {
  let zodCall = factory.createIdentifier(schemaList[0]) as ts.Expression;

  for (let i = 1; i < schemaList.length; i++) {
    zodCall = factory.createCallExpression(
      factory.createPropertyAccessExpression(zodCall, factory.createIdentifier('extend')),
      undefined,
      [
        factory.createPropertyAccessExpression(
          factory.createIdentifier(schemaList[i]),
          factory.createIdentifier('shape')
        )
      ]
    );
  }

  zodCall = factory.createCallExpression(
    factory.createPropertyAccessExpression(zodCall, factory.createIdentifier('extend')),
    undefined,
    args
  );

  return withProperties(zodCall, properties);
}

export function buildSchemaReference(
  node: ts.IndexedAccessTypeNode,
  metadata: Metadata,
  path = ""
): ts.PropertyAccessExpression | ts.Identifier {
  const indexTypeText = node.indexType.getText(metadata.sourceFile);
  const { indexTypeName, type: indexTypeType } = /^"\w+"$/.exec(indexTypeText)
    ? { type: 'string' as const, indexTypeName: indexTypeText.slice(1, -1) }
    : { type: 'number' as const, indexTypeName: indexTypeText };

  if (indexTypeName === '-1') {
    // Get the original type declaration
    const declaration = findNode(
      metadata.sourceFile,
      (n): n is ts.InterfaceDeclaration | ts.TypeAliasDeclaration => {
        return (
          (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) &&
          ts.isIndexedAccessTypeNode(node.objectType) &&
          n.name.getText(metadata.sourceFile) ===
            node.objectType.objectType.getText(metadata.sourceFile).split('[')[0]
        );
      }
    );

    if (declaration && ts.isIndexedAccessTypeNode(node.objectType)) {
      const key = node.objectType.indexType.getText(metadata.sourceFile).slice(1, -1); // remove quotes
      const members =
        ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)
          ? declaration.type.members
          : ts.isInterfaceDeclaration(declaration)
          ? declaration.members
          : [];

      const member = members.find((m) => m.name?.getText(metadata.sourceFile) === key);

      if (member && ts.isPropertySignature(member) && member.type) {
        // Array<type>
        if (
          ts.isTypeReferenceNode(member.type) &&
          member.type.typeName.getText(metadata.sourceFile) === 'Array'
        ) {
          return buildSchemaReference(node.objectType, metadata, `element.${path}`);
        }
        // type[]
        if (ts.isArrayTypeNode(member.type)) {
          return buildSchemaReference(node.objectType, metadata, `element.${path}`);
        }
        // Record<string, type>
        if (
          ts.isTypeReferenceNode(member.type) &&
          member.type.typeName.getText(metadata.sourceFile) === 'Record'
        ) {
          return buildSchemaReference(node.objectType, metadata, `valueSchema.${path}`);
        }

        console.warn(` »   Warning: indexAccessType can’t be resolved, fallback into 'any'`);
        return factory.createIdentifier('any');
      }
    }

    return factory.createIdentifier('any');
  } else if (indexTypeType === 'number' && ts.isIndexedAccessTypeNode(node.objectType)) {
    return buildSchemaReference(node.objectType, metadata, `items[${indexTypeName}].${path}`);
  }

  if (ts.isIndexedAccessTypeNode(node.objectType)) {
    return buildSchemaReference(node.objectType, metadata, `shape.${indexTypeName}.${path}`);
  }

  if (ts.isTypeReferenceNode(node.objectType)) {
    const dependencyName = `${camelize(node.objectType.typeName.getText(metadata.sourceFile))}Schema`;
    metadata.dependencies.push(dependencyName);
    return factory.createPropertyAccessExpression(
      factory.createIdentifier(dependencyName),
      factory.createIdentifier(`shape.${indexTypeName}.${path}`.slice(0, -1))
    );
  }

  throw new Error('Unknown IndexedAccessTypeNode.objectType type');
}
