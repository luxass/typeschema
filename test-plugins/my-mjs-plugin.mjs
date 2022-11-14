// @ts-check

import ts from "typescript";

/**
 * @type {import("../src").TypeSchemaPlugin} TypeSchemaPlugin
 */
export const MyMJSPlugin = {
  name: "my-mjs-plugin",
  setup(ctx) {
    console.log('my-mjs-plugin setup');

    ctx.register(ts.SyntaxKind.InterfaceDeclaration);


    // ctx.onNode('InterfaceDeclaration', (node) => {
    //   console.log(node);
    // });

    // ctx.onWrite('zod', { })
  }
}