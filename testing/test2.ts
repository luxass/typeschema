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
  test?: Test
}

type Test = string

interface A {
  a: string;
}
