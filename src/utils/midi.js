export class Midi {
  constructor() {
    this.midi;

    if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess().then((midiAccess) => {
        this.midi = midiAccess;
        let inputs = this.midi.inputs.values();
        if (this.midi.inputs.size === 0) {
          /* Play with Keyboard for testing */
          console.log("No MIDI Device detected, switching to keyboard control...");
          this._useKeyboard();
        } else {
          this._listInputsAndOutputs(midiAccess);
          console.log('MIDI Connection established.');
        }
        for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
          input.value.onmidimessage = this._onMIDIMessage.bind(this);
        }
      }, ()=> {
        alert("The MIDI system failed to start.  You're gonna have a bad time.");
      });
    } else {
      alert("No MIDI support present in your browser.  You're gonna have a bad time.") 
    }
  }

  _onMIDIMessage(event) {
    let data = {
      cmd: event.data[0] >> 4,
      channel: event.data[0] & 0xf,
      type: event.data[0] & 0xf0,
      note: event.data[1],
      velocity: event.data[2]
    }

    switch (data.type) {
        case 144: // noteOn message 
            if(data.velocity != 0) {
              this._noteOn(data.note, data.velocity);
              break;
            }
        case 128: // noteOff message
            this._noteOff(data.note, data.velocity);
            break;
        case 208: // aftertouch message
            delete data.note;
            data.velocity = event.data[1];
            this._aftertouch(data.velocity);
            break;
        case 176: // control change message
            Object.assign(data, {
              number: event.data[1],
              value: event.data[2]
            });
            delete data.note;
            delete data.velocity;
            this._controlChange(data.number, data.value);
            break;
    }

    window.dispatchEvent(new CustomEvent('midi:message', {
      'detail': data
    }));

    console.log(data);
  }

  _noteOn(note, velocity) {
    window.dispatchEvent(new CustomEvent('midi:noteOn', {
      'detail': { note, velocity }
    }));
  }

  _noteOff(note, velocity) {
    window.dispatchEvent(new CustomEvent('midi:noteOff', {
      'detail': { note, velocity }
    }));
  }

  _aftertouch(velocity) {
    window.dispatchEvent(new CustomEvent('midi:aftertouch', {
      'detail': { velocity }
    }));
  }

  _controlChange(number, value) {
    window.dispatchEvent(new CustomEvent('midi:controlChange', {
      'detail': { number, value }
    }));
  }

  _listInputsAndOutputs(midiAccess) {
    for (let entry of midiAccess.inputs) {
      let input = entry[1];
      console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
        "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
        "' version:'" + input.version + "'" );
    }

    for (let entry of midiAccess.outputs) {
      let output = entry[1];
      console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
        "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
        "' version:'" + output.version + "'" );
    }
  }

  _useKeyboard() {
    function onKeyDown(event) {
      this._noteOn(event.keyCode-50, 100);
      document.removeEventListener('keypress', onKeyDownBound);
      document.addEventListener('keyup', onKeyUpBound);
    }
    let onKeyDownBound = onKeyDown.bind(this);

    function onKeyUp(event) {
      this._noteOff(event.keyCode-18, 100);
      document.addEventListener('keypress', onKeyDownBound);
      document.removeEventListener('keyup', onKeyUpBound);
    }
    let onKeyUpBound = onKeyUp.bind(this);

    document.addEventListener('keypress', onKeyDownBound);
  }
}
