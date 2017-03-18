import React from "react";
import {autobind} from "core-decorators";
import Cursor from "../cursor";
import All from "./all";

@autobind
export default class NonTerminal extends React.Component {
  static contextTypes = {
    mode: React.PropTypes.string,
    cursor: React.PropTypes.object,
    seen: React.PropTypes.any,
  };

  static childContextTypes = {
    mode: React.PropTypes.string,
    cursor: React.PropTypes.object,
    seen: React.PropTypes.any,
  };

  static propTypes = {
    ast: React.PropTypes.bool,
  };

  static defaultProps = {
    ast: false,
  };

  constructor(props, context) {
    super(props, context);
    this.cursor = context.cursor;
  }

  getChildContext() {
    let seen = {...this.context.seen};
    // HACK? this.constructor.name might break with uglify, apparently.
    if (!(this.constructor.name in seen)) {
      // const dis = React.createElement(
      //   Object.create(this),
      //   this.props,
      //   ...React.Children.toArray(this.children)
      // );
      seen[this.constructor.name] = true;
    }
    return {
      ...this.context,
      mode: this.props && this.props.ast ? "ast" : this.context.mode,
      seen,
      cursor: this.cursor,
    };
  }

  parse() {
    if (React.Children.count(this.props.children) === 1) {
      console.log("One child");
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

      return (
        <NonTerminal ast>
          {newChildren}
        </NonTerminal>
      );
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

    return (
      <All>
        {this.props.children}
      </All>
    );
  }

  render() {
    // If we're at the root element, we won't have a context, but the data
    // will be available in props
    const mode = this.context.mode || this.props.mode;
    console.log("name: ", this.constructor.name);
    console.log("mode: ", mode);
    if (mode === "define") {
      const childCount = React.Children.count(this.props.children);
      // We've rendered this node before, so don't recurse infinitely
      // FIXME: Probably need to do diffing on props, since we could have
      // the same node with different props at different levels of the grammar tree.
      // As this currently stands, if we define a node that takes in children,
      // it'll only render properly with children the first time the node appears
      // in the tree.
      // Might see if there is a way to make React do that diffing for us.
      if (this.context.seen != null && this.constructor.name in this.context.seen)
        return null;
      // Haven't seen this node before, go ahead and actually render it
      console.log("not seen, running define");
      return this.define();
    } else if (mode === "parse") {
      return this.parse();
    } else {
      return null;
    }
  }
};
