export class Midi {
  constructor() {
    this.midi;
    this.messageCallback = () => {};

    if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess().then((midiAccess) => {
        this.midi = midiAccess;
        console.log('MIDI Connection established.');

        let inputs = this.midi.inputs.values();
        for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
          input.value.onmidimessage = this._onMIDIMessage.bind(this);
        }
        
        this._listInputsAndOutputs(midiAccess);
      }, ()=> {
        alert("The MIDI system failed to start.  You're gonna have a bad time.");
      });
    } else {
      alert("No MIDI support present in your browser.  You're gonna have a bad time.") 
    }
  }

  onMessageListener(callback) {
    this.messageCallback = callback;
  }

  _onMIDIMessage(event) {
    console.log(event.data);

    let data = {
      cmd: event.data[0] >> 4,
      channel: event.data[0] & 0xf,
      type: event.data[0] & 0xf0,
      note: event.data[1],
      velocity: event.data[2]
    }

    switch (data.type) {
        case 144: // noteOn message 
             this._noteOn(data.note, data.velocity);
             break;
        case 128: // noteOff message 
            this._noteOff(data.note, data.velocity);
            break;
    }
    
    this.messageCallback(data);
  }

  _noteOn(note, velocity) {}

  _noteOff(note, velocity) {}


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
}