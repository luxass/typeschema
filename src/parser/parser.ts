import ts from 'typescript';

import { warn } from '../log';
import { PluginContainer } from '../plugin-container';
import { TypeSchemaTree } from '../types';
import { parseEnum } from './enum';
import { parseInterface } from './interface';
import { parseTypeAlias } from './type-alias';

export async function parseTypes(
  program: ts.Program,
  nodes: ts.NodeWithSourceFile[],
  pluginContainer: PluginContainer
) {
  const typeChecker = program.getTypeChecker();
  const trees: TypeSchemaTree[] = [];

  let usingGenerics: boolean = false;

  // Filter out generics.
  // This is not supported in zod, but we can do something like generics inside JSON Schema.
  // https://gist.github.com/luxass/4a54711a656908ae3d3ab4e5e8d90133
  nodes = nodes.filter(({ node }) => {
    if ((node as any).typeParameters) {
      usingGenerics = true;
      return false;
    }
    return true;
  });

  if (usingGenerics) {
    warn('NOT SUPPORTED', 'Generics is not supported yet.');
  }


  const parsers: any[] = [];

  pluginContainer.setContext({
    typeChecker,
    register: (node, parser) => {
      parsers.push({ node, parser });
    }
  });

  await pluginContainer.initialize();

  nodes.forEach(({ node, sourceFile }) => {
    const isMatching = parsers.find(({ node: subNode }) => subNode === node.kind);

    if (isMatching) {
      console.log('skip', ts.SyntaxKind[node.kind]);
      const tree = isMatching.parser(node);
      trees.push(tree);
    }
  });

  return trees;
}