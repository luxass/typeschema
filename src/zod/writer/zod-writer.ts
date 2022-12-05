import ts from 'typescript';

import { TypeSchemaTree } from '../../types';
import { writeObject } from './object';

export function writeZodSchema(trees: TypeSchemaTree[]): ts.VariableStatement[] {
  const schemas: ts.VariableStatement[] = [];
  for (const tree of trees) {
    const { name, type } = tree;

    switch (type) {
      case 'object':
        schemas.push(writeObject(tree));
        break;
      case 'string':
        break;
      case 'number':
        break;
      case 'boolean':
        break;
    }
  }
  return schemas;
}
