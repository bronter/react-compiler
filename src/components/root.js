import React from "react";
import Node from "./node";
import Cursor from "../cursor";

export default class Root extends Node {
  static propTypes = {
    mode: React.PropTypes.string,
    input: React.PropTypes.string,
  };

  static defaultProps = {
    mode: "define",
    input: "",
  };

  static childContextTypes = {
    mode: React.PropTypes.string,
    input: React.PropTypes.string,
    cursor: React.PropTypes.any,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      cursor: new Cursor(0),
    };
  }

  getChildContext() {
    return {
      mode: this.props.mode,
      cursor: this.state.cursor,
      input: this.props.input,
    };
  }

  // shouldComponentUpdate() {
  //   return this.isFrozen;
  // }

  render() {
    return super.render();
  }
};
