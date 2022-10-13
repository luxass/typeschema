import { TypeSchemaNodeV2 } from '../../types';

export function parseBoolean(): TypeSchemaNodeV2 {
  return {
    type: 'boolean'
  };
}
