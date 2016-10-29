import React from 'react';

export class Indicator extends React.Component {
  constructor() {
    super();
    this.element;
  }

  componentDidMount() {
    this.element = this.refs.elementRef;
  }

  componentWillReceiveProps(props) {
    let timeline = new TimelineMax();
    timeline.to(this.element, 0.1, {
      opacity: (1 / this.props.max)*props.value
    }).to(this.element, 1, {
      opacity: 0,
      ease: Expo.easeNone
    });
  }

  render() {
    return (
      <div ref="elementRef" className="indicator"/ >
    );
  }
}
