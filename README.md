# TypeSchema

> Convert TypeScript Types to Zod Schemas, JSON Schemas. - built for [Zotera](https://github.com/zotera/zotera)

## Installation

```bash
npm install typeschema
```

## Setup

```typescript
import { createJSONSchema, createZodSchema } from 'typeschema';
```

## TypeSchema Tree

> TypeSchema Tree is a tree structure that defines how we gonna make the schema.

```json
{
  "name": "MyDB",
  "type": "object",
  "properties": {
    "users": {
      "required": true
    }
  }
}
```

## Mappings of TypeSchema Tree Types

```md
Type, Interface -> object
string -> string
number -> number
boolean -> boolean
array -> array
enum -> enum

```

# TAGS

jsonschema-ref - Sets top level ref

# Not Supported

* Class without names