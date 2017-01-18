import React from "react";

export default class Token extends React.Component {
  static propTypes = {
    children: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    match: React.PropTypes.string,
  };

  static defaultProps = {
    children: "",
    name: null,
    match: null,
  };

  constructor() {
    // Show me the booty
    super();
  }

  parse() {
    const pos = this.context.cursor.pos;
    if (this.context.input.substring(pos).startsWith(this.children)) {
      this.context.cursor.pos += this.children.length;
      return (
        <Token
          pos={pos}
          length={this.children.length}
          match={this.children}
        />
      );
    }
    return null;
  }

  generate() {
    return this.props.match;
  }

  evaluate() {
    return this.generate();
  }

  define() {
    return this.props.children;
  }
};
