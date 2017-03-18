import React from "react";
import {autobind} from "core-decorators";
import Cursor from "../cursor";

@autobind
export default class Root extends React.Component {
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

  parse() {
    if (React.Children.count(this.props.children) === 1) {
      return React.Children.only(this.props.children).parse();
    } else {
      const children = React.Children.toArray(this.props.children);

      // Create a cursor if we don't already have one
      const oldCursor = this.context.cursor || new Cursor(0);
      console.log("Multiple children, cursor pos is: ", oldCursor.pos,
                  " this.constructor.name is: ", this.constructor.name);

      this.cursor = new Cursor(oldCursor.pos);

      let newChildren = [];
      for (let i = 0; i < children.length; ++i) {
        const child = children[i].parse();
        if (child == null) return null;
        newChildren.push(React.cloneElement(child, {key: i}));
      }

      oldCursor.pos = this.cursor.pos;

      return null;
      // return (
      //   <NonTerminal ast>
      //     {newChildren}
      //   </NonTerminal>
      // );
    }
  }

  generate() {
    if (React.Children.count(this.props.children) === 1) {
      return React.Children.only(this.props.children).generate();
    } else {
      return React.Children.forEach(this.props.children, child => child.generate());
    }
  }

  evaluate() {
    if (React.Children.count(this.props.children) === 1) {
      return React.Children.only(this.props.children).evaluate();
    } else { // Default to All node behavior if multiple children
      return React.Children.forEach(this.props.children, child => child.evaluate());
    }
  }

  define() {
    console.log("this.props.children is ", React.Children.count(this.props.children));

    return null;
    // return (
    //   <All>
    //     {this.props.children}
    //   </All>
    // );
  }

  render() {
    const mode = this.props.mode;
    console.log("mode: ", mode);
    if (mode === "define") {
      return this.define();
    } else if (mode === "parse") {
      return this.parse();
    } else {
      return null;
    }
  }
};
