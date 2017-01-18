import React from "react";
import Cursor from "../cursor";

export default class Sequence extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    minimum: React.PropTypes.number,
    maximum: React.PropTypes.number,
  };

  static defaultProps = {
    minimum: 0,
    maximum: -1,
  };

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
    const maximum = this.props.maximum;
    if (maximum === 0) return null;
    const minimum = this.props.minimum;
    let count = 0;
    let length = 0;
    let children = [];
    this.cursor = new Cursor(this.context.cursor.pos);
    while (maximum < 0 || count < maximum) {
      const child = this.children.parse();
      if (child == null) break;
      ++count;
      if (count >= minimum) {
        if (maximum < 0) {
          children.push(child);
          break;
        } else if (count >= maximum) {
          return null;
        }
        children.push(child);
      }
    }
    let index = 0;
    children = React.Children.map(
      this.props.children,
      child => React.cloneElement(child, {
        key: index++,
      })
    );

    if (count === 0) {
      return null;
    } else {
      this.context.cursor.pos = this.cursor.pos;
      return (
        <Sequence>
          {children}
        </Sequence>
      );
    }
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
