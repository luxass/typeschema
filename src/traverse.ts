import ts, { Identifier } from 'typescript';

import { debug, warn } from './log';
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

  if (!tagFilter(tags)) return;

  if ('name' in node) {
    const identifier = node.name as Identifier;
    if (typeof identifier === 'undefined') {
      debug(`Node has no name.`);
      return;
    }
    if (!identifier.text) {
      debug(`Node has no text`);
      return;
    }
    const name = identifier.getText(sourceFile);
    console.log(`Found node with name: ${name}`);

    rootNodes.set(name, {
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
