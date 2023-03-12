import { TsType } from "@swc/core";
import { Visitor } from "@swc/core/Visitor.js";

export class Traverse extends Visitor {

  constructor() {
    super();
  }

  visitTsType(expression: TsType) {
    console.log("TS TYPE EXPRESSION", expression);
    
    return expression;
  }
}
