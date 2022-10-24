import ts from 'typescript';

import { warn } from '../log';
import { PrettiedTags, TypeSchemaTree } from '../types';
import { getPrettyJSDoc, getTypeName, parseMembers } from '../utils';

export function parseInterface(
  typeNode: ts.NodeWithSourceFile<ts.InterfaceDeclaration>
): TypeSchemaTree {
  const { node, sourceFile } = typeNode;
  const _properties: TypeSchemaTree[] = [];
  let heritageClauses: string[] = [];

  if (node.heritageClauses) {
    heritageClauses = node.heritageClauses.reduce((prev: string[], curr) => {
      if (curr.token !== ts.SyntaxKind.ExtendsKeyword || !curr.types) return prev;
      const heritages = curr.types.map((expression) => expression.getText(sourceFile));

      // const heritages = curr.types.map((expression) => camelize(expression.getText(sourceFile)));

      return prev.concat(heritages);
    }, []);
  }

  const { properties, indexSignature } = parseMembers(node.members);

  properties.forEach((property) => {
    if (!property.type) return;
    const typeName = getTypeName(property.type, sourceFile);
    const name = property.name.getText(sourceFile);
    const annotations = getPrettyJSDoc(property, sourceFile);
    const required = !property.questionToken;
    console.log('property', ts.SyntaxKind[property.type.kind], name);

    switch (property.type.kind) {
      case ts.SyntaxKind.ArrayType:
        const elementType = (property.type as ts.ArrayTypeNode).elementType;
        if (ts.isTypeLiteralNode(elementType)) {
          const { properties: memberProperties, indexSignature } = parseMembers(
            elementType.members
          );
          const properties = memberProperties
            .map((property) => {
              if (!property.type) return;
              const typeName = getTypeName(property.type, sourceFile);
              const name = property.name.getText(sourceFile);
              const annotations = getPrettyJSDoc(property, sourceFile);
              const required = !property.questionToken;
              return {
                name,
                type: typeName,
                annotations,
                required
              };
            })
            .filter(Boolean);
          return _properties.push({
            name,
            type: typeName,
            annotations,
            required,
            items: {
              type: 'object',
              properties: properties as TypeSchemaTree[]
            }
          });
        }

        if (ts.isTypeReferenceNode(elementType)) {
          console.log('ARRAY TYPE REFERENCE');
        }
        _properties.push({
          name,
          type: typeName,
          items: {
            $ref: (property.type as ts.ArrayTypeNode).elementType.getText(),
            type: getTypeName((property.type as ts.ArrayTypeNode).elementType, sourceFile)
          },
          annotations,
          required
        });
        return;
      case ts.SyntaxKind.TypeLiteral:
        if (typeName === 'array') {
          return _properties.push({
            name,
            type: typeName,
            annotations,
            required
          });
        }
        return _properties.push({
          name,
          type: typeName,
          required,
          annotations
        });

      case ts.SyntaxKind.TypeReference:
        if (typeName === 'array') {
          const typeArguments = (property.type as ts.TypeReferenceNode).typeArguments ?? [];
          return _properties.push({
            name,
            type: typeName,
            items: {
              $ref: typeArguments[0].getText(),
              type: getTypeName(typeArguments[0], sourceFile)
            },
            annotations,
            required
          });
        }
        return _properties.push({
          name,
          type: typeName,
          required,
          annotations
        });
    }

    _properties.push({
      name,
      type: typeName,
      annotations,
      required
    });
  });

  return {
    name: node.name.text,
    type: 'object',
    properties: _properties,
    heritageClauses,
    annotations: getPrettyJSDoc(node, sourceFile),
    additionalProperties: Boolean(indexSignature)
  };
}
