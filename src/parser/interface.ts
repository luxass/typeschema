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

  properties.forEach((property) => {
    if (!property.type) return;
    const typeName = getTypeName(property.type);
    const annotations = getPrettyJSDoc(property, sourceFile);

    switch (property.type.kind) {
      case ts.SyntaxKind.TypeReference:
        _properties.push({
          name: property.name.getText(sourceFile),
          type: typeName,
          annotations
        });
        break;
      case ts.SyntaxKind.ArrayType:
        _properties.push({
          name: property.name.getText(sourceFile),
          type: typeName,
          annotations,
          items: {
            // Should use the ref to the type.
            type: getTypeName((property.type as ts.ArrayTypeNode).elementType)
          }
        });
        break;
      // case ts.SyntaxKind.UnionType:
      //   const unionType = getTypeName(property.type);
      //   const unionAnnotations = getPrettyJSDoc(property.node, sourceFile);
      //   _properties.push({
      //     name: property.name,
      //     type: 'union',
      //     unionType,
      //     annotations: unionAnnotations
      //   });
      //   break;
      case ts.SyntaxKind.TypeLiteral:
        _properties.push({
          name: property.name.getText(sourceFile),
          type: typeName,
          annotations
        });
        break;
      default:
        warn('WARNING', `Unknown type: ${node.getText()}, SyntaxKind[${node.kind}]=${ts.SyntaxKind[node.kind]}`);
    }
    // if (ts.isTypeLiteralNode(property.type)) {
    //   _properties.push(parseTypeLiteral(property.type));
    //   return;
    // }

    // if (ts.isTypeReferenceNode(property.type)) {
    //   _properties.push(parseTypeReference(property.type, sourceFile));
    //   return;
    // }

    // const name = property.name.getText(sourceFile);

    // _properties.push({
    //   name,
    //   type: getTypeName(property.type),
    //   required: !!property.questionToken,
    //   additionalProperties: false
    // });
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
