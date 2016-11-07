import React from 'react';
import ReactDOM from 'react-dom';

import { Midi } from '../utils/midi';
import { ProtoSynth } from '../protosynth/protosynth';

import { MidiRecorder } from '../utils/midi-recorder';

import { SynthUI } from './synth-ui/SynthUI.component';
import { RecorderUI } from './recorder-ui/RecorderUI.component';
import { Indicator } from './indicator/Indicator.component';

/**
 *  TODO: 
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
    this.midiRecorder = new MidiRecorder();

    /* MIDIMessageListener */
    window.addEventListener('midi:message', ({ detail: data }) => {
      this.setState({
        cmd: data.cmd,
        channel: data.channel,
        type: data.type,
      });
    });

    /* NoteOnListener */
    window.addEventListener('midi:noteOn', ({ detail: data }) => {
      this.setState({
        note: data.note,
        velocity: data.velocity
      });
    });

    /* AftertouchListener */
    window.addEventListener('midi:aftertouch', ({ detail: data }) => {
      this.setState({
        velocity: data.velocity
      });
    });
  }

  render() {
    return (
      <div className="main">
        <div className="midi-info">
          <span>Cmd: {this.state.cmd}</span><br/>
          <span>Channel: {this.state.channel}</span><br/>
          <span>Type: {this.state.type}</span><br/>
          <span>Note: {this.state.note}</span><br/>
          <span>Velocity: {this.state.velocity}</span>
          <div className="indicators">
            <Indicator max="127" value={this.state.velocity} />
            <Indicator max="127" value={this.state.velocity} />
          </div>
        </div>
        <SynthUI synth={this.synth} />
        <RecorderUI recorder={this.midiRecorder} />
      </div>
    );
  }
}

export default App;
