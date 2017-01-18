import React from "react";

export default class Integer extends React.Component {
  static propTypes = {
    length: React.PropTypes.number,
    match: React.PropTypes.string,
    radix: React.PropTypes.number,
    value: React.PropTypes.number,
  };

  static defaultProps = {
    radix: 0,
  };

  parse() {
    const pos = this.context.cursor.pos;
    const match = /\d+/.exec(this.context.input.substring(pos));
    if (match == null || match.index !== 0) return null;
    this.context.cursor.pos += match[0].length;
    return (
      <Integer
          pos={pos}
          length={match[0].length}
          match={match[0]}
          value={parseInt(match[0], this.props.radix)}
      />
    );
  }

  generate() {
    return this.props.value;
  }

  evaluate() {
    return this.props.value;
  }

  define() {
    return null;
  }
};
