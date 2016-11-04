import React from 'react';

export class SynthUI extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      polyphone: this.props.synth.oscillator.polyphone,
      type: this.props.synth.oscillator.getParam('osc.type'),
      detune: this.props.synth.oscillator.getParam('osc.detune.value'),
      attack: this.props.synth.oscillator.getParam('env.attack'),
      decay: this.props.synth.oscillator.getParam('env.decay'),
      sustain: this.props.synth.oscillator.getParam('env.sustain'),
      release: this.props.synth.oscillator.getParam('env.release'),
      filter: this.props.synth.filter.frequency.value
    }
  }

  handleChange(event) {
    let synth = this.props.synth;
    let value = event.target.value;
    switch (event.target.name) {
      case "polyphoneCtrl":
        synth.oscillator.setPolyphony(event.target.checked);
        this.setState({polyphone: event.target.checked});
        break;
      case "typeCtrl":
        synth.oscillator.setParam('osc.type', value);
        this.setState({type: value});
        break;
      case "pitchCtrl":
        synth.oscillator.setParam('osc.detune.value', value);
        this.setState({detune: value});
        break;
      case "attackCtrl":
        synth.oscillator.setParam('env.attack', parseFloat(value));
        this.setState({attack: value});
        break;
      case "decayCtrl":
        synth.oscillator.setParam('env.decay', parseFloat(value));
        this.setState({decay: value});
        break;
      case "sustainCtrl":
        synth.oscillator.setParam('env.sustain', parseFloat(value));
        this.setState({sustain: value});
        break;
      case "releaseCtrl":
        synth.oscillator.setParam('env.release', parseFloat(value));
        this.setState({release: value});
        break;
      case "filterCtrl":
        synth.filter.frequency.value = parseFloat(value);
        this.setState({filter: value});
        break;
    }
  }

  render() {
    return (
      <div>
        <h1>protoSYNTH</h1>
        <label className="synth-input" htmlFor="polyphoneCtrl">Polyphone:
          <input type="checkbox" name="polyphoneCtrl" 
            checked={this.state.polyphone}
            onChange={this.handleChange} />
        </label>
        <label className="synth-input" htmlFor="typeCtrl">Waveform:
          <select name="typeCtrl" id="typeCtrl" value={this.state.type}
            onChange={this.handleChange} >
            <option value="sine">sine</option>
            <option value="square">square</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
          </select>
        </label> 
        
        <label className="synth-input" htmlFor="pitchCtrl">Detune:
          <input type="range" name="pitchCtrl"
            min="-1000" max="1000" step="1"
            value={this.state.detune}
            onChange={this.handleChange}
          /> {this.props.synth.oscillator.getParam('osc.detune.value')} cents
        </label>

        <div className="synth-input">ADSR:
          <label className="vertical" htmlFor="attackCtrl">A
            <input type="range" name="attackCtrl"
              min="0" max="2" step="0.005"
              value={this.state.attack}
              onChange={this.handleChange}
            />{this.props.synth.oscillator.getParam('env.attack').toFixed(3)}
          </label>
          <label className="vertical" htmlFor="decayCtrl">D
            <input type="range" name="decayCtrl"
              min="0" max="3" step="0.01"
              value={this.state.decay}
              onChange={this.handleChange}
            />{this.props.synth.oscillator.getParam('env.decay').toFixed(3)}
          </label>
          <label className="vertical" htmlFor="sustainCtrl">S
            <input type="range" name="sustainCtrl"
              min="0" max="1" step="0.01"
              value={this.state.sustain}
              onChange={this.handleChange}
            />{this.props.synth.oscillator.getParam('env.sustain').toFixed(3)}
          </label>
          <label className="vertical" htmlFor="releaseCtrl">R
            <input type="range" name="releaseCtrl"
              min="0" max="3" step="0.01"
              value={this.state.release}
              onChange={this.handleChange}
            />{this.props.synth.oscillator.getParam('env.release').toFixed(3)}
          </label>
        </div>

        <label className="synth-input" htmlFor="filterCtrl">Lowpass Filter:
          <input type="range" name="filterCtrl"
            min="0" max="14000" step="1"
            value={this.state.filter}
            onChange={this.handleChange}
          /> {this.props.synth.filter.frequency.value} Hz
        </label>

      </div>
    );
  }
}
