/**
 * Creation and decoration of an GainNode object.
 * 
 */

export default function createEnvelope(audioCtx, options = {}) {
  let env = audioCtx.createGain();
  env.gain.value = options.gain || 0.0;
  Object.assign(env, {
    attack: (options.attack || 0.0)+0.0000001,
    decay: (options.decay || 0.0)+0.0000001,
    sustain: options.sustain || 1,
    release: (options.release || 0.0)+0.0000001,
    retrigger: options.retrigger || false,
    velFactor: options.velFactor || 0,
    fixedSustain: options.fixedSustain || false
  });

  /* on Attack */
  env.startEnvelope = (level = 1) => {
    if(env.retrigger) {
      env.gain.cancelScheduledValues(0);
    }
    let volume = 1-((1-level)*env.velFactor);
    env.gain.setTargetAtTime(volume, 0, env.attack);
    let sustain = env.fixedSustain ? env.sustain : env.sustain*volume;
    env.gain.setTargetAtTime(sustain, audioCtx.currentTime+env.attack, env.decay);
  }

  /* on Release */
  env.endEnvelope = () => {
    env.gain.cancelScheduledValues(0);
    env.gain.setTargetAtTime(0.0, 0, env.release);
  }

  /* setter */
  env.setAttack = (value) => {
    env.attack = value + 0.00000001;
  }

  env.setDecay = (value) => {
    env.decay = value + 0.00000001;
  }

  env.setSustain = (value) => {
    env.sustain = value + 0.00000001;
  }

  env.setRelease = (value) => {
    env.release = value + 0.00000001;
  }

  return env;
}
