import { globby } from 'globby';
import fs from 'node:fs/promises';
import { dirname } from 'node:path';
import ts from 'typescript';

import { info, warn } from './log';
import { Metadata, PrettiedTags, ZodProperty } from './types';

function isJsDoc(node: ts.Node): node is ts.JSDoc {
  return node.kind === ts.SyntaxKind.JSDoc;
}

export function getJSDoc(node: ts.Node, sourceFile: ts.SourceFile): ts.JSDoc[] {
  const result = [];

  for (const child of node.getChildren(sourceFile)) {
    if (!isJsDoc(child)) break;
    result.push(child);
  }

  return result;
}

export function getPrettyJSDoc(node: ts.Node, sourceFile: ts.SourceFile) {
  const tags = getJSDoc(node, sourceFile);
  const prettiedTags: PrettiedTags[] = [];
  tags.forEach((_tag) => {
    (_tag.tags || []).forEach((tag) => {
      prettiedTags.push({
        tagName: tag.tagName.escapedText.toString(),
        comment: tag.comment || undefined
      });
    });
  });
  return prettiedTags;
}

async function doesExist(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFile(path: string, data: string) {
  try {
    const dirName = dirname(path);
    const exist = await doesExist(dirName);
    if (!exist) {
      await fs.mkdir(dirName, { recursive: true });
    }

    await fs.writeFile(path, data);
  } catch (err) {
    throw new Error(err);
  }
}

// TODO: This is not great for things like HTPasswd -> hTPasswd
export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function getPropertiesFromTags(tags: PrettiedTags[], metadata: Metadata): ZodProperty[] {
  const properties: string[] = [];
  // reduce tags

  const zodProperties: ZodProperty[] = tags.reduce((prev, curr) => {
    warn('CURR', curr);
    warn('PREV', prev);

    prev.push({
      identifier: ''
    });
    return prev;
  }, [] as ZodProperty[]);

  return [];
}

export function findNode<TNode extends ts.Node>(
  sourceFile: ts.SourceFile,
  predicate: (node: ts.Node) => node is TNode
) {
  let declarationNode: TNode | undefined;

  const visitor = (node: ts.Node) => {
    if (!declarationNode && predicate(node)) {
      declarationNode = node;
    }
  };
  ts.forEachChild(sourceFile, visitor);

  return declarationNode;
}

export async function convertInputFilesToRegex(inputFiles: string[]): Promise<RegExp> {
  info('CONVERT', inputFiles);
  console.log(await getGlobby(inputFiles));

  // Convert inputFiles into regex

  return new RegExp('');
}

export async function getGlobby(inputFiles: string[]) {
  return await globby(inputFiles, {
    absolute: true
  });
}
