/**
 *  A basic synthesizer prototype.
 * 
 */

export class ProtoSynth {
  constructor(midi) {
    this.midi = midi;
    this.activeNotes = [];
    this.lastNote = {note: 0, velocity: 0};

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 440;
    this.envelope = this.audioCtx.createGain();
    this.oscillator.connect(this.envelope);
    this.envelope.connect(this.audioCtx.destination);
    this.envelope.gain.value = 0.0;
    this.oscillator.start(0);

    /* NoteOnListener */
    window.addEventListener('midi:noteOn', ({ detail: data }) => {
      this.activeNotes.push(data);
      this.lastNote = this._getLastNote();
      this.oscillator.frequency.cancelScheduledValues(0);
      this.oscillator.frequency.setTargetAtTime( this.getLastNoteFreq(), 0, 0.05);
      this.envelope.gain.cancelScheduledValues(0);
      this.envelope.gain.setTargetAtTime(this.velocityToVolume(this.lastNote.velocity), 0, 0.05);
    });

    /* NoteOffListener */
    window.addEventListener('midi:noteOff', ({ detail: data }) => {
      let noteOffIndex = this.activeNotes.findIndex(({ note }) => {
        return note === data.note;
      });
      
      if (noteOffIndex !== -1) {
        this.activeNotes.splice(noteOffIndex, 1);
        this.lastNote = this._getLastNote();
      }

      if(this.activeNotes.length <= 0) {
        this.envelope.gain.cancelScheduledValues(0);
        this.envelope.gain.setTargetAtTime(0.0, 0, 0.05 );
      } else {
        this.oscillator.frequency.cancelScheduledValues(0);
        this.oscillator.frequency.setTargetAtTime( this.getLastNoteFreq(), 0, 0.05);
        this.envelope.gain.cancelScheduledValues(0);
        this.envelope.gain.setTargetAtTime(this.velocityToVolume(this.lastNote.velocity), 0, 0.05);
      }
    });

    /* AftertouchListener */
    // window.addEventListener('midi:aftertouch', ({ detail: data }) => {
    //   envelope.gain.setTargetAtTime(this.velocityToVolume(data.velocity), 0, 0.05);
    // });

    /* ControlChangeListener */
    window.addEventListener('midi:controlChange', ({ detail: data }) => {
      this.oscillator.frequency.cancelScheduledValues(0);
      this.oscillator.frequency.setTargetAtTime(this.getLastNoteFreq()*(this.velocityToVolume(data.value)*2), 0, 0.05);
    });
  }

  _getLastNote() {
    return this.activeNotes.length > 0 ?
      this.activeNotes[this.activeNotes.length-1] : this.lastNote;
  }

  getLastNoteFreq() {
    return this.noteToFreq(this.lastNote.note);
  }

  noteToFreq(note) {
    return 440 * Math.pow(2,(note-69)/12);
  }

  velocityToVolume(velocity) {
    return (1 / 128)*velocity;
  }
}
