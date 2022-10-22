import ts from 'typescript';

import { TypeSchemaTree } from '../types';
import { parseEnum } from './enum';
import { parseInterface } from './interface';

export function parseTypeScript(
  program: ts.Program,
  nodes: ts.NodeWithSourceFile[]
): TypeSchemaTree[] {
  const typeChecker = program.getTypeChecker();
  const trees: TypeSchemaTree[] = [];

  nodes.forEach((node) => {
    // Throw errors on generics.
    // This is not supported in zod, but we can do something like generic inside JSON Schema.
    // https://gist.github.com/luxass/4a54711a656908ae3d3ab4e5e8d90133
    if ((node as any).typeParameters) {
      throw new TypeError('Generics are not supported at the moment!');
    }

    if (ts.isInterfaceDeclaration(node.node)) {
      const tree = parseInterface(node as ts.NodeWithSourceFile<ts.InterfaceDeclaration>);
      trees.push(tree);
    }

    if (ts.isTypeAliasDeclaration(node.node)) {
      throw new TypeError('Type alias declarations are not supported!');
    }

    if (ts.isEnumDeclaration(node.node)) {
      const enumTree = parseEnum(node as ts.NodeWithSourceFile<ts.EnumDeclaration>, typeChecker);
      trees.push(enumTree);
    }
  });

  return trees;
}
