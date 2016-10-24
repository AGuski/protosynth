import React from 'react';
import ReactDOM from 'react-dom';

import { Midi } from '../utils/midi';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cmd: '',
      channel: '',
      type: '',
      note: '',
      velocity: ''
    }

    this.midi = new Midi();

    this.midi.onMessageListener((data) => {
      this.setState({
        cmd: data.cmd,
        channel: data.channel,
        type: data.type,
        note: data.note,
        velocity: data.velocity
      });
    });
  }

  render() {
    return (
      <div>
        <span>Cmd: {this.state.cmd}</span><br/ >
        <span>Channel: {this.state.channel}</span><br/ >
        <span>Type: {this.state.type}</span><br/ >
        <span>Note: {this.state.note}</span><br/ >
        <span>Velocity: {this.state.velocity}</span>
      </div>
    );
  }
}

export default App;