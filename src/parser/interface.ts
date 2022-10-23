import ts from 'typescript';

import { warn } from '../log';
import { TypeSchemaTree } from '../types';
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
  console.log('GDFGDFGDFG', node.name.getText(sourceFile));

  if (indexSignature) {
    console.log(ts.SyntaxKind[indexSignature!.type.kind]);
  }

  console.log('LENGTH', properties.length);

  properties.forEach((property) => {
    if (!property.type) return;
    if (ts.isTypeLiteralNode(property.type)) {
      _properties.push(parseTypeLiteral(property.type));
      return;
    }

    if (ts.isTypeReferenceNode(property.type)) {
      _properties.push(parseTypeReference(property.type, sourceFile));
      return;
    }

    const name = property.name.getText(sourceFile);

    _properties.push({
      name,
      type: getTypeName(property.type),
      optional: !!property.questionToken
      // additionalProperties: false
    });
  });

  return {
    name: node.name.text,
    type: 'object',
    properties: _properties,
    heritageClauses,
    annotations: getPrettyJSDoc(node, sourceFile)
  };
}

export function parseTypeLiteral(typeNode: ts.TypeLiteralNode): TypeSchemaTree {
  
  return {
    name: '',
    type: 'object',
    properties: []
  };
}

export function parseTypeReference(
  typeNode: ts.TypeReferenceNode,
  sourceFile: ts.SourceFile
): TypeSchemaTree {
  const identifierName = typeNode.typeName.getText(sourceFile);

  return {
    name: identifierName,
    type: 'object',
    properties: []
  };
}
