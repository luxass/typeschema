import ts from 'typescript';

import { TypeSchemaPlugin } from '../src';

export const MyTypeScriptPlugin: TypeSchemaPlugin = {
  name: 'my-typescript-plugin',
  setup(ctx) {
    console.log('my-typescript-plugin setup');
    ctx.register(ts.SyntaxKind.InterfaceDeclaration, (node) => {
      console.log('my-typescript-plugin InterfaceDeclaration', node.kind);
      return {
        name: 'object-baby-mama',
        type: 'object-baby',
      };
    });

    ctx.register(ts.SyntaxKind.ArrayType, (node) => {
      console.log('my-typescript-plugin InterfaceDeclaration', node.kind);
      return {
        name: 'object-baby-mama',
        type: 'object-baby',
      };
    });
    // ctx.onNode('ClassDeclaration', () => {
    //   console.log('my-typescript-plugin ClassDeclaration');
    // });

    // ctx.register({
    //   name: 'MyType',
    //   description: 'MyType description',
    //   serialize: (value) => {
    //     return value;
    //   }
    // });

    // ctx.write('')
  }
};
