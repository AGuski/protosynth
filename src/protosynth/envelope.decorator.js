/**
 * Creation and decoration of an GainNode object.
 * 
 */

export default function createEnvelope(audioCtx, options = {}) {
  let envelope = audioCtx.createGain();
  envelope.gain.value = options.gain || 0.0;
  Object.assign(envelope, {
    attack: (options.attack || 0.0)+0.0000001,
    decay: (options.decay || 0.0)+0.0000001,
    sustain: options.sustain || 1,
    release: (options.release || 0.0)+0.0000001,
    retrigger: options.retrigger || false,
    velFactor: options.velFactor || 0,
    fixedSustain: options.fixedSustain || false
  });
  
  /* on Attack */
  envelope.startEnvelope = (level = 1) => {
    if(envelope.retrigger) {
      envelope.gain.cancelScheduledValues(0);
    }
    let volume = 1-((1-level)*envelope.velFactor);
    envelope.gain.setTargetAtTime(volume, 0, envelope.attack);
    let sustain = envelope.fixedSustain ? envelope.sustain : envelope.sustain*volume;
    envelope.gain.setTargetAtTime(sustain, audioCtx.currentTime+envelope.attack, envelope.decay);
  }

  /* on Release */
  envelope.endEnvelope = () => {
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setTargetAtTime(0.0, 0, envelope.release);
  }

  return envelope;
}
