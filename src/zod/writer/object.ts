import ts from 'typescript';

import { TypeSchemaTree } from '../../types';

const factory = ts.factory;

export function writeObject(tree: TypeSchemaTree): ts.VariableStatement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(tree.name),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('z'),
              factory.createIdentifier('object')
            ),
            undefined,
            [
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    factory.createIdentifier('name'),
                    factory.createStringLiteral(tree.name)
                  )
                ],
                true
              )
            ]
          )
        )
      ],
      ts.NodeFlags.Const
    )
  );
}
