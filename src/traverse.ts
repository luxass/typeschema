import ts from 'typescript';

import { warn } from './log';
import { JSDocOptions, PrettiedTags } from './types';
import { getPrettyJSDoc } from './utils';

interface TraverseOptions {
  node: ts.Node;
  rootNodes: Map<string, ts.NodeWithSourceFile>;
  sourceFile: ts.SourceFile;
  jsDocOptions: JSDocOptions;
}

export function traverse({ node, rootNodes, sourceFile, jsDocOptions }: TraverseOptions) {
  const tagFilter = jsDocOptions.include
    ? (tags: PrettiedTags[]) =>
        tags.map((tag) => tag.tagName).includes(jsDocOptions.include || 'typeschema')
    : () => true;

  const tags = getPrettyJSDoc(node, sourceFile);

  if (ts.isEnumDeclaration(node)) {
    if (!tagFilter(tags)) return;
    rootNodes.set(node.name.text, {
      node,
      sourceFile
    });
  }

  if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    if (node.typeParameters) {
      warn('NOT SUPPORTED', `${node.name.escapedText} is not supported (generic)`);
      return;
    }

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
