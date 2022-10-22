import ts from 'typescript';
import { EnumMember, TypeSchemaTree } from '../types';
import { getPrettyJSDoc } from '../utils';

export function parseEnum(
  typeNode: ts.NodeWithSourceFile<ts.EnumDeclaration>,
  typeChecker: ts.TypeChecker
): TypeSchemaTree {
  const { node, sourceFile } = typeNode;
  const annotations = getPrettyJSDoc(node, sourceFile);
  const _members: EnumMember[] = [];

  node.members.forEach((member) => {
    const name = member.name.getText(sourceFile);
    const constantValue = typeChecker.getConstantValue(member);

    if (constantValue !== undefined) {
      _members.push({
        name: name,
        value: constantValue
      });
      return;
    }

    if (!member.initializer) {
      _members.push({
        name: name,
        value: _members.length
      });
    } else {
      _members.push({
        name: name,
        value: parseInitializer(member.initializer)
      });
    }
  });

  return {
    name: node.name.text,
    type: 'enum',
    members: _members,
    annotations
  };
}

function parseInitializer(initializer: ts.Node): string | number | undefined {
  if (initializer.kind === ts.SyntaxKind.UndefinedKeyword) {
    return;
  } else if (initializer.kind === ts.SyntaxKind.StringLiteral) {
    return (initializer as ts.LiteralLikeNode).text;
  } else if (initializer.kind === ts.SyntaxKind.ParenthesizedExpression) {
    return parseInitializer((initializer as ts.ParenthesizedExpression).expression);
  } else if (initializer.kind === ts.SyntaxKind.AsExpression) {
    return parseInitializer((initializer as ts.AsExpression).expression);
  } else if (initializer.kind === ts.SyntaxKind.TypeAssertionExpression) {
    return parseInitializer((initializer as ts.TypeAssertion).expression);
  } else {
    return initializer.getText();
  }
}
