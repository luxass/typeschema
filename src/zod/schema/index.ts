import ts from 'typescript';

import { error } from '../../log';
import { ZodConfig } from '../../types';
import { camelize, getPrettyJSDoc } from '../../utils';
import { getEnum, getNativeEnum } from './enum';
import { getObject } from './object';
import { getPrimitive } from './primitive';

const factory = ts.factory;

type SchemaNode = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration;

export function getZodSchema(node: SchemaNode, sourceFile: ts.SourceFile, config: ZodConfig) {
  let dependencies: string[] = [];
  let schema: ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression | undefined;
  let imports: string[] = [];

  // Throw errors on generics.
  if ((node as any).typeParameters) {
    throw new TypeError('Generics are not supported!');
  }

  if (ts.isInterfaceDeclaration(node)) {
    let heritageClauses: string[] | undefined;

    // extends
    if (node.heritageClauses) {
      heritageClauses = node.heritageClauses.reduce((prev: string[], curr) => {
        if (curr.token !== ts.SyntaxKind.ExtendsKeyword || !curr.types) return prev;

        const heritages = curr.types.map((expression) => camelize(expression.getText(sourceFile)));

        return prev.concat(heritages);
      }, []);
      dependencies = heritageClauses;
    }
    schema = getObject(node, {
      dependencies,
      heritageClauses,
      sourceFile
    });
  }

  if (ts.isTypeAliasDeclaration(node)) {
    const tags = config.jsdoc?.useTags ? getPrettyJSDoc(node, sourceFile) : [];

    schema = getPrimitive(node.type, {
      dependencies,
      isOptional: false,
      tags,
      sourceFile
    });
  }

  if (ts.isEnumDeclaration(node)) {
    const tags = getPrettyJSDoc(node, sourceFile);
    if (tags.find((tag) => tag.tagName === 'native-enum' || tag.tagName === 'nativeEnum')) {
      console.log('DEPES', dependencies);

      schema = getNativeEnum(node, sourceFile, imports);
    } else {
      schema = getEnum(node, sourceFile);
    }
  }

  return {
    dependencies: [...new Set(dependencies)],
    imports: [...new Set(imports)],
    schema: factory.createVariableStatement(
      node.modifiers,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(`${camelize(node.name.text)}Schema`),
            undefined,
            undefined,
            schema
          )
        ],
        ts.NodeFlags.Const
      )
    )
  };
}
