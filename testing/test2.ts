interface User /*extends A*/ {
  name: string;
  age: number;
  lol?: string;
  aaa?: {
    bbb: string;
  };
  bbbbb: Array<string>;
  aaaa: {
    bbb: string;
  }[];
  aaaaa: Array<{
    bbb: string;
  }>;
  a: A;
  test?: Test;
}

type Test = string;
type B = Test;

interface A {
  a: string;
}

export type GG<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends Array<infer U>
  ? Array<GG<U>>
  : T extends object
  ? { [K in keyof T]: GG<T[K]> }
  : T;

export interface AAB<T> {
  a: T;
}

const LL = "hey! I'm a string";

class LittleBitch {
  constructor(public name: string) {}
}