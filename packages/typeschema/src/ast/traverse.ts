import type { TsType, TsTypeAliasDeclaration } from "@swc/core";
import { Visitor } from "@swc/core/Visitor.js";

export class Traverse extends Visitor {
  constructor() {
    super();
  }

  visitTsType(expression: TsType) {
    console.log("TS TYPE EXPRESSION", expression);

    return expression;
  }

  visitTsTypeAliasDeclaration(n: TsTypeAliasDeclaration) {
    console.log("TS TYPE ALIAS DECLARATION", JSON.stringify(n, null, 2));

    if (n.id.value === "Names") {
      if (n.typeAnnotation.type === "TsUnionType") {
        n.typeAnnotation.types.push({
          type: "TsLiteralType",
          span: {
            ctxt: 0,
            start: 48,
            end: 54
          },
          literal: {
            type: "StringLiteral",
            span: {
              ctxt: 0,
              start: 48,
              end: 54
            },
            value: "Jill",
            raw: "\"Jill\""
          }
        });
        // n.typeAnnotation = this.visitTsType(n.typeAnnotation);
      }
    }

    return n;
  }
}
