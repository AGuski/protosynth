/**
 *  A simple Recorder of MIDI-like data. I am not so sure about the jquery event listeners....
 *  
 *  Stage 1: use good ol' DateTime + setTimeout
 *  Stage 2: I want performance.now() ! -> compare to before
 *  Stage 3: Do rock solid scheduled timing as described here: https://www.html5rocks.com/en/tutorials/audio/scheduling/
 * 
 *  This UI updating sucks!! How to make it better?!?
 * 
 */

export class MidiRecorder {
  constructor() {
    this.track = {
      begin: 0,
      length: 0,
      events: []
    }
    this.listeners;
    this.recording = false;
    this.playing = false;
  }

  startRecord() {
    console.log('startRec');
    this.recording = true;
    this.track.events = [];
    this.track.begin = Date.now();

    $(window).on('midi:message', ({ detail: data }) => {
        // TODO - does only work with midiInput and doubles noteOn/Off;
    });
    $(window).on('midi:noteOn', ({ detail: data }) => {
        this.track.events.push(
          {type: 'noteOn', data: data, timestamp: Date.now() - this.track.begin }
        )
        this.updateUI();
    });
    $(window).on('midi:noteOff', ({ detail: data }) => {
        this.track.events.push(
          {type: 'noteOff', data: data, timestamp: Date.now() - this.track.begin }
        )
        this.updateUI();
    });
    this.updateUI();
  }

  stopRecord() {
    console.log('stopRec');
    this.recording = false;
    this.track.length = Date.now() - this.track.begin;
    $(window).off('midi:message');
    $(window).off('midi:noteOn');
    $(window).off('midi:noteOff');
    this.updateUI();
  }

  startPlayback() {
    console.log('startPlay');
    this.playing = true;
    for (let event of this.track.events) {
      setTimeout(() => {
        if (this.playing) {
          this.sendData(event);
        }
      }, event.timestamp);
    }

    setTimeout(() => {
      if (this.playing) {
        this.stopPlayback();
      }
    }, this.track.length);
    this.updateUI();
  }

  stopPlayback() {
    console.log('stopPlay');
    this.playing = false;
    this.updateUI();
  }

  sendData(event) {
    let data = event.data;
    switch(event.type) {
      case 'noteOn':
        window.dispatchEvent(new CustomEvent('midi:noteOn', {
          'detail': { note: data.note, velocity: data.velocity }
        }));
        break;
      case 'noteOff':
        window.dispatchEvent(new CustomEvent('midi:noteOff', {
          'detail': { note: data.note, velocity: data.velocity }
        }));
        break;
      default:
    }
    this.updateUI();
  }


}