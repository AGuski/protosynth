/**
 *  A basic synthesizer prototype.
 * 
 */

import createOscillator from './oscillator.decorator';
import createEnvelope from './envelope.decorator';

export class ProtoSynth {
  constructor(midi) {
    this.midi = midi;
    this.activeNotes = [];
    this.lastNote = {note: 0, velocity: 0};

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.oscillator = createOscillator(this.audioCtx, {
      type: 'sawtooth',
      glide: false
    });

    this.envelope = createEnvelope(this.audioCtx, {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.2,
      retrigger: true,
    });

    /* Connections */
    this.oscillator.connect(this.envelope);
    this.envelope.connect(this.audioCtx.destination);

    /* Start */
    this.oscillator.start(0);

    /* NoteOnListener */
    window.addEventListener('midi:noteOn', ({ detail: data }) => {
      this.activeNotes.push(data);
      this.lastNote = this._getLastNote();
      this.oscillator.changeFrequency(this.getLastNoteFreq());
      this.envelope.startEnvelope(this.velocityToVolume(this.lastNote.velocity));
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
        this.envelope.endEnvelope();
      } else {
        this.oscillator.changeFrequency(this.getLastNoteFreq());
      }
    });

    /* AftertouchListener */
    // window.addEventListener('midi:aftertouch', ({ detail: data }) => {

    // });

    /* ControlChangeListener */
    window.addEventListener('midi:controlChange', ({ detail: data }) => {
      this.oscillator.changeFrequency(this.getLastNoteFreq()*(this.velocityToVolume(data.value)*2));
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
