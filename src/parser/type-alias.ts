import ts from 'typescript';

import { TypeSchemaTree } from '../types';
import { getTypeName } from '../utils';

export function parseTypeAlias(
  typeNode: ts.NodeWithSourceFile<ts.TypeAliasDeclaration>
): TypeSchemaTree {
  const { node, sourceFile } = typeNode;

  const name = node.name.getText(sourceFile);
  const type = getTypeName(node.type, sourceFile);
  return {
    name,
    type

    // properties: _properties,
    // heritageClauses,
    // annotations: getPrettyJSDoc(node, sourceFile),
    // additionalProperties: Boolean(indexSignature)
  };
}
