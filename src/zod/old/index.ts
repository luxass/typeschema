import ts from 'typescript';

import { ZodConfig } from '../../types';
import { camelize, getPrettyJSDoc } from '../../utils';
import { buildObject } from './object';
import { buildPrimitive } from './primitive';
import { buildSchema } from './schema';

const factory = ts.factory;

export function getZodSchema(
  node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration,
  name: string,
  sourceFile: ts.SourceFile,
  config: ZodConfig
): {
  dependencies: string[];
  schema: ts.VariableStatement;
} {
  let schema: ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression | undefined;
  let dependencies: string[] = [];

  if (ts.isInterfaceDeclaration(node)) {
    let schemaExtensionClauses: string[] | undefined;
    if (node.typeParameters) {
      throw new Error('Interface with generics are not supported!');
    }

    if (node.heritageClauses) {
      schemaExtensionClauses = node.heritageClauses.reduce((deps: string[], h) => {
        if (h.token !== ts.SyntaxKind.ExtendsKeyword || !h.types) {
          return deps;
        }

        const heritages = h.types.map(
          (expression) => `${camelize(expression.getText(sourceFile))}Schema`
        );

        return deps.concat(heritages);
      }, []);

      dependencies = dependencies.concat(schemaExtensionClauses);
    }

    schema = buildObject(node, {
      dependencies,
      heritageClauses: schemaExtensionClauses,
      sourceFile
    });
  }

  if (ts.isTypeAliasDeclaration(node)) {
    if (node.typeParameters) {
      throw new Error('Type with generics are not supported!');
    }
    const tags = config.jsdoc?.useTags ? [] : getPrettyJSDoc(node, sourceFile);
    
    schema = buildPrimitive(node.type, {
      dependencies,
      isOptional: false,
      tags,
      sourceFile
    });
  }

  if (ts.isEnumDeclaration(node)) {
    schema = buildSchema('nativeEnum', [node.name]);
  }

  return {
    dependencies: [...new Set(dependencies)],
    schema: factory.createVariableStatement(
      node.modifiers,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(`${camelize(name)}Schema`),
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
