import { JSONSchema, TypeSchemaTree } from '../../types';
import { writeObject } from './object';

type JSONSchemaDefinitions = JSONSchema['definitions'];

export function writeJSONSchema(trees: TypeSchemaTree[]): JSONSchemaDefinitions {
  const definitions: JSONSchemaDefinitions = {};
  for (const tree of trees) {
    const { name, type } = tree;

    switch (type) {
      case 'object':
        definitions[name] = writeObject(tree);
        break;
      case 'string':
        break;
      case 'number':
        break;
      case 'boolean':
        break;
    }

    if (type === 'enum') {
      definitions[name] = {
        type: 'string',
        enum: tree.members.map((member) => member.value)
      };
    }
  }
  return definitions;
}
