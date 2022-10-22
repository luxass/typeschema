// /**
// * @typeschema-jsonschema-properties
// * @type1 {number[]}
// * @type2 {Array.<number>}
// * @type3 {Array<number>}
// * @type1 {number[]}
// * @type2 {Array.<number>}
// * @type3 {Array<number>}
// */
// interface MyFirstSchema {
//   users: User[]; // Array<User>
// }

// /**
//  * @typeschema
//  * @jsonschema-properties
//  * @type1 {number[]}
//  * @type2 {Array.<number>}
//  * @type3 {Array<number>}
//  * @type1 {number[]}
//  * @type2 {Array.<number>}
//  * @type3 {Array<number>}
//  */
// interface User extends A {
//   name: string;
//   age: number;
//   aaa: {
//     bbb: string;
//   }
//   aaaa: {
//     bbb: string;
//   }[]
//   bbb: A
// }

// interface A {
//   [key: string]: any;
//   a: string;
// }

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
  AA,
  GG,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = '123'.length,
  A = 'true'.length,
  Q = ([].length as any).length,
  AAAA = ([])[0]
}

