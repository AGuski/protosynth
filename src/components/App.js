import React from 'react';
import ReactDOM from 'react-dom';

import { Midi } from '../utils/midi';
import { ProtoSynth } from '../protosynth/protosynth';

/**
 *  TODO: Find DRY Solution for multiple listeners on own classes.
 * 
 * 
 */

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
    this.synth = new ProtoSynth(this.midi);

    /* MIDIMessageListener */
    this.midi.onMessageListener((data) => {
      this.setState({
        cmd: data.cmd,
        channel: data.channel,
        type: data.type,
      });
    });

    /* NoteOnListener */
    this.midi.onNoteOnListener((data) => {
      this.setState({
        note: data.note,
        velocity: data.velocity
      });
      this.runSimpleIndicator('.vel-indicator', data.velocity);
    });
  }

  render() {
    return (
      <div className="main">
        <span>Cmd: {this.state.cmd}</span><br/>
        <span>Channel: {this.state.channel}</span><br/>
        <span>Type: {this.state.type}</span><br/>
        <span>Note: {this.state.note}</span><br/>
        <span>Velocity: {this.state.velocity}</span>
        <div className="indicators">
          <div className="indicator vel-indicator" ></div>
          <div className="indicator" ></div>
        </div>
      </div>
    );
  }

  /* Auszulagern */

  runSimpleIndicator(selector, value) {
    let timeline = new TimelineMax();
    timeline.to(selector, 0.1, {
      opacity: (1 / 128)*value
    }).to(selector, 1, {
      opacity: 0,
      ease: Expo.easeNone
    });
  }

}

export default App;