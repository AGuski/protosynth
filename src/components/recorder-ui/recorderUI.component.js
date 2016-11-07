import React from 'react';

export class RecorderUI extends React.Component {
  constructor(props) {
    super(props);


    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
    this.props.recorder.updateUI = this.update;
    this.state = {
      recording: this.props.recorder.recording,
      playing: this.props.recorder.playing
    }
  }

  update() {
    this.forceUpdate();
  }

  handleClick(event) {
    let recorder = this.props.recorder;
    switch (event.target.name) {
      case 'recordButton':
        if (!this.state.recording) {
          recorder.startRecord();
          this.setState({recording: true});
        } else {
          recorder.stopRecord();
          this.setState({recording: false});
        }
        break;
      case 'playButton':
      if (!this.state.playing) {
          recorder.startPlayback();
          this.setState({playing: true});
        } else {
          recorder.stopPlayback();
          this.setState({playing: false});
        }
        break;
      default:
    }
  }

  handleChange(event) {
    
  }

  render() {
    return (
      <div>
        <h1>midiRecorder</h1>
        <div className="recorder-info">
          <span className="recorder-button">Track length: {this.props.recorder.track.length} ms.</span>
          <span className="recorder-button">Track events: {this.props.recorder.track.events.length}</span>
        </div>
        <label className="recorder-button" htmlFor="recordButton">
          <input type="button" name="recordButton" 
                 value={this.props.recorder.recording ? 'STOP' : 'RECORD'} 
                 onClick={this.handleClick} 
          />
        </label>
        <label className="recorder-button" htmlFor="playButton">
          <input type="button" name="playButton" 
                 value={this.props.recorder.playing ? 'STOP' : 'PLAY'} 
                 onClick={this.handleClick} 
          />
        </label>
      </div>
    );
  }
}
