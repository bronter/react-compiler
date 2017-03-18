import React from "react";
import {autobind} from "core-decorators";

@autobind
export default class All extends React.Component {
  static contextTypes = {
    mode: React.PropTypes.string,
    cursor: React.PropTypes.any, // FIXME: ctrl+shift+f PropTypes.any and get rid of them
  };

  static childContextTypes = {
    cursor: React.PropTypes.object,
    mode: React.PropTypes.string,
  };

  static propTypes = {
    children: React.PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.cursor = context.cursor;
  }

  getChildContext() {
    return {
      ...this.context,
      cursor: this.cursor,
    };
  }

  parse() {
    const children = React.Children.toArray(this.props.children);

    this.cursor = new Cursor(this.context.cursor.pos);

    let newChildren = [];
    for (let i = 0; i < children.length; ++i) {
      const child = children[i].parse();
      if (child == null) return null;
      newChildren.push(React.cloneElement(child, {key: i}));
    }

    this.context.cursor.pos = this.cursor.pos;

    return (
      <All>
        {newChildren}
      </All>
    );
  }

  generate() {
    return React.Children.map(this.props.children, child => child.generate());
  }

  evaluate() {
    return this.generate();
  }

  define() {
    if (Array.isArray(this.props.children)) {
      this.props.children.map(child => console.log(child));
    } else {
      console.log(this.props.children);
    }
    return null;
  }

  render() {
    const mode = this.context.mode;

    console.log("porps: ", this.props);

    return mode === "define" ? this.define() : this.parse();
  }
};
