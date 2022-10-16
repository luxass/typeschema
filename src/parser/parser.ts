import ts from 'typescript';

import { TypeSchemaTree } from '../types';
import { parseInterface } from './interface';

export function parseTypeScript(nodes: ts.NodeWithSourceFile[]): TypeSchemaTree[] {
  const trees: TypeSchemaTree[] = [];

  nodes.forEach((node) => {
    // Throw errors on generics.
    if ((node as any).typeParameters) {
      throw new TypeError('Generics are not supported!');
    }

    if (ts.isInterfaceDeclaration(node.node)) {
      const tree = parseInterface(node as ts.NodeWithSourceFile<ts.InterfaceDeclaration>);
      trees.push(tree);
    }

    if (ts.isTypeAliasDeclaration(node.node)) {
      throw new TypeError('Type alias declarations are not supported!');
    }

    if (ts.isEnumDeclaration(node.node)) {
      throw new TypeError('Enum declarations are not supported!');
    }
  });

  return trees;
}
