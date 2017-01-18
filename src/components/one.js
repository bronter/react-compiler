import React from "react";

export default class One extends React.Component {
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


    let newChild = null;
    let found = false;
    let foundCursor = null;
    for (let i = 0; i < children.length; ++i) {
      if (!found) this.cursor = new Cursor(this.context.cursor.pos);
      const child = children[i].parse();
      if (child != null) {
        // Don't allow for more than one, that's the rule
        if (found) return null;
        found = true;
        newChild = child;
        foundCursor = this.cursor;
      }
    }

    if (!found) return null;

    this.context.cursor.pos = foundCursor.pos;

    return newChild;
  }

  define() {
    return this.props.children;
  }
};
