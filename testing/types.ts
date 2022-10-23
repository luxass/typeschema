/**
 * @typeschema
 * @jsonschema-ref
 */
interface MyFirstSchema {
  users: User[]; // Array<User>
}

interface GG {
  [key: string]: any;
}

interface AAA {}

interface User /*extends A*/ {
  name: string;
  age: number;
  lol?: string;
  aaa?: {
    bbb: string;
  };
  aaaa: {
    bbb: string;
  }[];
  a: A;
}

interface A {
  [key: string]: any;
  a: string;
}

// enum Test {
//   A = 'a',
//   B = 'b'
// }

// enum AA {
//   A = 'a',
//   B = 'b'
// }

// enum A {
//   B,
//   C,
//   D
// }

enum FileAccess {
  // constant members
  None,
  /**
   * @typeschema
   */
  AA,
  GG,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = '123'.length,
  A = 'true'.length,
  Q = ([].length as any).length,
  AAAA = [][0]
}
