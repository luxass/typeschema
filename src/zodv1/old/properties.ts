import ts from 'typescript';

import { Metadata } from '../../types';
import { getPrettyJSDoc } from '../../utils';
import { buildPrimitive } from './primitive';

export type ZodProperty = {
  identifier: string;
  expressions?: ts.Expression[];
};

const factory = ts.factory;

export function withProperties(expression: ts.Expression, properties: ZodProperty[] = []) {
  return properties.reduce(
    (expressionWithProperties, property) =>
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          expressionWithProperties,
          factory.createIdentifier(property.identifier)
        ),
        undefined,
        property.expressions ? property.expressions : undefined
      ),
    expression
  ) as ts.CallExpression;
}

export function buildProperties(
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
