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
  if (indexSignature) {
    console.log(ts.SyntaxKind[indexSignature!.type.kind]);
  }




  properties.forEach((property) => {
    if (!property.type) return;
    console.log('kind', ts.SyntaxKind[property.type.kind]);

    if (ts.isTypeLiteralNode(property.type) || ts.isTypeReferenceNode(property.type)) {
      return;
    }

    _properties.push({
      name: property.name.getText(sourceFile),
      type: getTypeName(property.type)
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
