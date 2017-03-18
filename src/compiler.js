import React from "react";
import ReactDOM from "react-dom/server";
import Root from "./components/root";

export default class Compiler {
  static parse(input, grammar) {
    // Define our grammar in react
    const root = React.createElement(Root, {mode: "define"}, grammar);
    ReactDOM.renderToString(root);

    // Now parse the input and generate an AST
    const ast = React.cloneElement(root, {mode: "parse", input})
    ReactDOM.renderToString(ast);

    return ast;
  }

  static generate(ast, inputScope={}) {
    return ast.generate(inputScope);
  }

  static evaluate(ast, inputScope={}) {
    return ast.evaluate(inputScope);
  }
};
