import {Compiler, Node, All, One, Integer, Token, Sequence} from "../src";

console.log("Node is", Node);

class Expression extends Node {
  define() {
    return (
      <All>
        <Token>(</Token>
        <One>
          <Expression />
          <BinaryExpression />
          <Integer />
        </One>
        <Token>)</Token>
      </All>
    );
  }

  evaluate() {
    const childExp = this.children.evaluate();
    return childExp[1];
  }
}

class BinaryExpresssion extends Node {
  define() {
    return (
      <All>
        <Expression />
        <One>
          <Token>^</Token>
          <Token>*</Token>
          <Token>/</Token>
          <Token>+</Token>
          <Token>-</Token>
        </One>
        <One>
          <Expression />
          <BinaryExpression />
        </One>
      </All>
    );
  }

  evaluate() {
    const childExp = this.children.evaluate();
    const funcs = {
      "^": (a, b) => Math.pow(a, b),
      "*": (a, b) => a * b,
      "/": (a, b) => a / b,
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
    };
    return funcs[childExp[1]](childExp[0], childExp[2]);
  }
}

export default function test() {
  const ast = Compiler.parse("(1+2+(3^(4*2)))", Expression);
  // TODO: Use an actual testing framework, this should do something like
  // expect(ast.evaluate()).toBe(6564);
  return ast.evaluate();
};
