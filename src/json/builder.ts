/**
 * TS-TO-ZOD
 * https://github.com/fabien0102/ts-to-zod
 */
 import ts from 'typescript';

 import { camelize } from '../utils';
 
 const factory = ts.factory;
 
 export function buildSchema(
   node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration,
   name: string
 ): ts.VariableStatement {
   let schema: ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression | undefined;
 
   if (ts.isInterfaceDeclaration(node)) {
     if (node.heritageClauses) {
       console.log('node.heritageClauses', node.heritageClauses);
       
      //  throw new Error('Inheritance is not supported, yet!');
     }
     schema = buildZodObject(node);
   }
 
   if (ts.isTypeAliasDeclaration(node)) {
     // schema = buildZodPrimitive(node.type);
   }
 
   if (ts.isEnumDeclaration(node)) {
     // schema = buildZodSchema('nativeEnum', [node.name]);
   }
 
   return factory.createVariableStatement(
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
   );
 }
 
 
 
 function buildZodObject(node: ts.TypeLiteralNode | ts.InterfaceDeclaration) {
   const { properties, indexSignature } = node.members.reduce<{
     properties: ts.PropertySignature[];
     indexSignature?: ts.IndexSignatureDeclaration;
   }>(
     (mem, member) => {
       if (ts.isIndexSignatureDeclaration(member)) {
         return {
           ...mem,
           indexSignature: member
         };
       }
       if (ts.isPropertySignature(member)) {
         return {
           ...mem,
           properties: [...mem.properties, member]
         };
       }
       return mem;
     },
     { properties: [] }
   );
 
   // if (properties.length) {
   //   const parsedProperties = buildZodProperties(properties);
 
   //   return buildZodSchema('object', [
   //     factory.createObjectLiteralExpression(
   //       Array.from(parsedProperties.entries()).map(([key, tsCall]) => {
   //         return factory.createPropertyAssignment(key, tsCall);
   //       }),
   //       true
   //     )
   //   ]);
   // }
 
   if (indexSignature) {
     const indexSignatureSchema = buildZodSchema('record', []);
   }
 
   return buildZodSchema('object', [factory.createObjectLiteralExpression()]);
 }
 
 export type ZodProperty = {
   identifier: string;
   expressions?: ts.Expression[];
 };
 
 function buildZodSchema(call: string, args?: ts.Expression[], properties?: ZodProperty[]) {
   const zodCall = factory.createCallExpression(
     factory.createPropertyAccessExpression(
       factory.createIdentifier('z'),
       factory.createIdentifier(call)
     ),
     undefined,
     args
   );
   return withZodProperties(zodCall, properties);
 }
 
 function withZodProperties(expression: ts.Expression, properties: ZodProperty[] = []) {
   return properties.reduce(
     (expressionWithProperties, property) =>
       factory.createCallExpression(
         factory.createPropertyAccessExpression(
           expressionWithProperties,
           factory.createIdentifier(property.identifier)
         ),
         undefined,
         property.expressions ? property.expressions : undefined
       ),
     expression
   ) as ts.CallExpression;
 }
 
 function buildZodProperties(members: ts.NodeArray<ts.TypeElement> | ts.PropertySignature[]) {
   const properties = new Map<
     ts.Identifier | ts.StringLiteral,
     ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression
   >();
   members.forEach((member) => {
     if (
       !ts.isPropertySignature(member) ||
       !member.type ||
       !(ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
     ) {
       return;
     }
 
     properties.set(member.name, buildZodPrimitive(member.type));
   });
   return properties;
 }
 
 function buildZodPrimitive(
   node: ts.TypeNode
 ): ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression {
   if (ts.isParenthesizedTypeNode(node)) {
     return buildZodPrimitive(node.type);
   }
 
   return buildZodSchema('any', [], []);
 }
 