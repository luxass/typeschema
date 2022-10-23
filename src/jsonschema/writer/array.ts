import { JSONSchemaDefinition, TypeSchemaTree } from '../../types';

export function writeArray(tree: TypeSchemaTree): JSONSchemaDefinition {
  const { annotations } = tree;

  return {
    type: 'object',
    properties: tree.properties?.reduce((acc, prop) => {
      acc[prop.name] = {
        ...(prop.type === 'object' ? { $ref: `#/definitions/${prop.name}` } : { type: prop.type }),
        ...(prop.members
          ? {
              enum: prop.members.map((member) => member.value)
            }
          : {})
      };
      return acc;
    }, {} as JSONSchemaDefinitions[string]['properties'])
  };
}
