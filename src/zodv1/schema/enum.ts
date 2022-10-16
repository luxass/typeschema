import ts from 'typescript';

import { createSchema } from './schema';

const factory = ts.factory;

export function getEnum(node: ts.EnumDeclaration, sourceFile: ts.SourceFile): ts.CallExpression {
  console.log(node.name.text);

  const members = node.members.map((member) => {
    const name = member.name.getText(sourceFile);
    const value = member.initializer?.getText(sourceFile).replace(/['"]/g, '');
    return { name, value };
  });

  return createSchema('enum', [
    factory.createArrayLiteralExpression(
      members.map((member) => factory.createStringLiteral(member.value ?? member.name))
    )
  ]);
}

// TODO: Fix nativeEnum
// Something like find all imports from the file,
// and match the import value with the enum name.
// this is probably the way to go, maybe.
export function getNativeEnum(
  node: ts.EnumDeclaration,
  sourceFile: ts.SourceFile,
  imports: string[]
): ts.CallExpression {
  imports.push('oralelelel');

  console.log(node.name.text);

  const members = node.members.map((member) => {
    const name = member.name.getText(sourceFile);
    const value = member.initializer?.getText(sourceFile).replace(/['"]/g, '');
    return { name, value };
  });

  return createSchema('nativeEnum', [
    factory.createArrayLiteralExpression(
      members.map((member) => factory.createStringLiteral(member.value ?? member.name))
    )
  ]);
}
