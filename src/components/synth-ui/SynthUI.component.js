import React from 'react';

export class SynthUI extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  
  }

  componentWillReceiveProps(props) {
    
  }

  handleChange(event) {
    let synth = this.props.synth;
    let value = event.target.value;
    switch (event.target.name) {
      case "type":
        synth.oscillator.type = value;
        break;
      case "pitch":
        synth.oscillator.frequency.cancelScheduledValues(0);
        synth.oscillator.frequency.setTargetAtTime(synth.getLastNoteFreq()*value, 0, 0.05);
        break;
    }
  }

  render() {
    return (
      <div>
        <h1>protoSYNTH</h1>
        <select name="type" id="type" value={this.props.synth.oscillator.type}
          onChange= {this.handleChange} >
          <option value="sine">sine</option>
          <option value="square">square</option>
          <option value="sawtooth">sawtooth</option>
          <option value="triangle">triangle</option>
        </select>
        <input type="range" name="pitch" min="0" max="2" step="0.01" onChange={this.handleChange}  />
      </div>
    );
  }
}
