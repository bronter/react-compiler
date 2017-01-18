import React from "react";

export default class Some extends React.Component {
  static childContextTypes = {
    cursor: React.PropTypes.object,
  };

  constructor() {
    super();
    this.cursor = this.context.cursor;
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
      if (child != null) newChildren.push(React.cloneElement(child, {key: i}));
    }

    if (newChildren.length === 0) return null;

    this.context.cursor.pos = this.cursor.pos;

    return (
      <Some>
        {newChildren}
      </Some>
    );
  }

  generate() {
    return React.Children.map(this.props.children, child => child.generate());
  }

  evaluate() {
    return this.generate();
  }

  define() {
    return this.props.children;
  }
};
