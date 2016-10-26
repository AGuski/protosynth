/**
 *  A basic synthesizer prototype.
 * 
 */

export class ProtoSynth {
  constructor(midi) {
    this.midi = midi;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    let oscillator = this.audioCtx.createOscillator();
    oscillator.frequency.value = 440;
    let envelope = this.audioCtx.createGain();
    oscillator.connect(envelope);
    envelope.connect(this.audioCtx.destination);
    envelope.gain.value = 0.0;
    oscillator.start(0);

    /* NoteOnListener */
    window.addEventListener('midi:noteOn', ({ detail: data }) => {
      oscillator.frequency.cancelScheduledValues(0);
      oscillator.frequency.setTargetAtTime( this.noteToFreq(data.note), 0, 0.05);
      this.midi.lastNote = data.note;
      envelope.gain.cancelScheduledValues(0);
      envelope.gain.setTargetAtTime(this.velocityToVolume(data.velocity), 0, 0.05);
    });

    /* NoteOffListener */
    window.addEventListener('midi:noteOff', ({ detail: data }) => {
      if(data.note === this.midi.lastNote) {
        envelope.gain.cancelScheduledValues(0);
        envelope.gain.setTargetAtTime(0.0, 0, 0.05 );
      }
    });
  }

  noteToFreq(note) {
    return 440 * Math.pow(2,(note-69)/12);
  }

  velocityToVolume(velocity) {
    return (1 / 128)*velocity;
  }
}
