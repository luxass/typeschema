// @typeschema-jsonschema-properties
// interface MyFirstSchema {
//   users: User[]; // Array<User>
// }

interface A {
  [key: string]: string | number;
  a: string;
}

/**
 * @typeschema
 * @jsonschema-properties
 * @type1 {number[]}
 * @type2 {Array.<number>}
 * @type3 {{Array<number>}
 * @type1 {number[]}
 * @type2 {Array.<number>}
 * @type3 {{Array<number>}
 */
interface User extends A {
  name: string;
  age: number;
}