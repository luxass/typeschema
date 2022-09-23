import ts from 'typescript';
import { warn } from "./log";

import { JSDocOptions, PrettiedTags, TypeSchemaNode } from './types';
import { getPrettyJSDoc } from './utils';

interface TraverseOptions {
  node: ts.Node;
  rootNodes: Map<string, TypeSchemaNode>;
  sourceFile: ts.SourceFile;
  jsDocOptions: JSDocOptions;
}

export function traverse({ node, rootNodes, sourceFile, jsDocOptions }: TraverseOptions) {
  const tagFilter = jsDocOptions.include
    ? (tags: PrettiedTags[]) =>
        tags.map((tag) => tag.tag).includes(jsDocOptions.include || 'typeschema')
    : () => true;

  if (ts.isEnumDeclaration(node)) {
    const tags = getPrettyJSDoc(node, sourceFile);
    if (!tagFilter(tags)) return;
    rootNodes.set(node.name.text, {
      node,
      sourceFile
    });
  }

  if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    if (node.typeParameters) {
      
      warn('warning', `${node.name.escapedText} is not supported (generic)`);
      return;
    }
    const tags = getPrettyJSDoc(node, sourceFile);

    if (!tagFilter(tags)) return;
    rootNodes.set(node.name.text, {
      node,
      sourceFile
    });
  }

  ts.forEachChild(node, (subNode) =>
    traverse({
      node: subNode,
      rootNodes,
      sourceFile,
      jsDocOptions
    })
  );
}
