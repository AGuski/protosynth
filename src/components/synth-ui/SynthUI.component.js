import React from 'react';

export class SynthUI extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      attack: this.props.synth.envelope.attack
    }
  }

  handleChange(event) {
    let synth = this.props.synth;
    let value = event.target.value;
    switch (event.target.name) {
      case "typeCtrl":
        synth.oscillator.type = value;
        break;
      case "pitchCtrl":
        synth.oscillator.detuneBy(value);
        break;
      case "attackCtrl":
        synth.envelope.setAttack(parseFloat(value));
        this.setState({attack: value});
        break;
      case "decayCtrl":
        synth.envelope.setDecay(parseFloat(value));
        this.setState({decay: value});
        break;
      case "sustainCtrl":
        synth.envelope.setSustain(parseFloat(value));
        this.setState({sustain: value});
        break;
      case "releaseCtrl":
        synth.envelope.setRelease(parseFloat(value));
        this.setState({release: value});
        break;
    }
  }

  render() {
    return (
      <div>
        <h1>protoSYNTH</h1>
        <label className="synth-input" htmlFor="typeCtrl">Waveform:
          <select name="typeCtrl" id="typeCtrl" value={this.props.synth.oscillator.type}
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
            onChange={this.handleChange}
          />
        </label>

        <div className="synth-input">ADSR:
          <label className="vertical" htmlFor="attackCtrl">A
            <input type="range" name="attackCtrl"
              min="0" max="2" step="0.005"
              value={this.state.attack}
              onChange={this.handleChange}
            />{this.props.synth.envelope.attack.toFixed(3)}
          </label>
          <label className="vertical" htmlFor="decayCtrl">D
            <input type="range" name="decayCtrl"
              min="0" max="3" step="0.01"
              value={this.state.decay}
              onChange={this.handleChange}
            />{this.props.synth.envelope.decay.toFixed(3)}
          </label>
          <label className="vertical" htmlFor="sustainCtrl">S
            <input type="range" name="sustainCtrl"
              min="0" max="1" step="0.01"
              value={this.state.sustain}
              onChange={this.handleChange}
            />{this.props.synth.envelope.sustain.toFixed(3)}
          </label>
          <label className="vertical" htmlFor="releaseCtrl">R
            <input type="range" name="releaseCtrl"
              min="0" max="3" step="0.01"
              value={this.state.release}
              onChange={this.handleChange}
            />{this.props.synth.envelope.release.toFixed(3)}
          </label>
        </div>
      </div>
    );
  }
}
