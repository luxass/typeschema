import { TypeSchemaParser } from "../types";

export function buildJSONSchema(): TypeSchemaParser {
  return {
    parse: () => {
      return {
        type: "object",
        properties: {},
      };
    },
  };
}