/**
 *  A basic synthesizer prototype.
 * 
 */

import PolyOscillator from './polyOscillator';

export class ProtoSynth {
  constructor(midi) {
    this.midi = midi;
    this.activeNotes = [];
    this.lastNote = {note: 0, velocity: 0};

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.oscillator = new PolyOscillator(this.audioCtx, {
      osc: {
        type: 'square',
        glide: false
      },
      env: {
        attack: 0.2,
        decay: 0.1,
        sustain: 0.1,
        release: 0.6,
        retrigger: true,
      }
    });
    this.oscillator.setPolyphony(false);

    /* NoteOnListener */
    window.addEventListener('midi:noteOn', ({ detail: data }) => {
      // Keep track of MIDI notes
      this.activeNotes.push(data);
      this.lastNote = this._getLastNote();
      // play oscillator
      this.oscillator.startTone(this.noteToFreq(data.note), data.velocity);
    });

    /* NoteOffListener */
    window.addEventListener('midi:noteOff', ({ detail: data }) => {
      // Get the index of the noteOff note
      let noteOffIndex = this.activeNotes.findIndex(({ note }) => {
        return note === data.note;
      });
      // remove it from the stack
      if (noteOffIndex !== -1) {
        this.activeNotes.splice(noteOffIndex, 1);
        this.lastNote = this._getLastNote();
      }
      //release oscillator
      this.oscillator.releaseTone(noteOffIndex, this.activeNotes, this.getLastNoteFreq());
    });

    /* AftertouchListener */
    // window.addEventListener('midi:aftertouch', ({ detail: data }) => {

    // });

    /* ControlChangeListener */
    // window.addEventListener('midi:controlChange', ({ detail: data }) => {
    //   // this.oscillator.changeFrequency(this.getLastNoteFreq()*(this.velocityToVolume(data.value)*2));
    // });
  }

  /* Get the latest noteOn note */
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
}
