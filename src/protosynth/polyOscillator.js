import createOscillator from './oscillator.decorator';
import createEnvelope from './envelope.decorator';

/**
 * A class for creating a multi-voice oscillator including an ADSR-envelope
 * for each voice.
 */

const MAX_VELOCITY = 127

export default class PolyOscillator {
  constructor(audioContext, options) {
    this.audioCtx = audioContext;
    this.params = {
      osc: options.osc,
      env: options.env
    };
    
    this.voices = [];
    this.polyphone = options.polyphone || true;
  
    this.template = {
      osc: createOscillator(this.audioCtx, this.params.osc),
      env: createEnvelope(this.audioCtx, this.params.env)
    }
    this.lastNoteFrequency = this.template.osc.frequency.value;
  }

  startTone(frequency, velocity = MAX_VELOCITY){
    // Add voices if polyphone
    if (this.polyphone || this.getAmountOfVoices() === 0) {
      this.addVoice();
    }

    // Play the latest voice
    let newestVoice = this.voices[this.getAmountOfVoices()-1];
    newestVoice.osc.changeFrequency(frequency);
    newestVoice.env.startEnvelope((1 / MAX_VELOCITY)*velocity);
    this.lastNoteFrequency = frequency;
  }

  releaseTone(index, activeNotes = [], beforeFrequency) {
    // Either remove voice or change pitch (poly vs mono)
    if(activeNotes.length <= 0 || this.polyphone) {
      this.removeVoice(index);
    } else {
      this.voices[0].osc.changeFrequency(beforeFrequency);
    }
  }

  /* Add a new voice with osc and env and activate it */
  addVoice() {
    let voice = {
      osc: createOscillator(this.audioCtx, this.params.osc),
      env: createEnvelope(this.audioCtx, this.params.env)
    };

    // manually setting audioParams
    voice.osc.detune.value = this.template.osc.detune.value;
    voice.osc.frequency.value = this.lastNoteFrequency;

    // Connections
    voice.osc.connect(voice.env);
    voice.env.connect(this.audioCtx.destination);
    this.voices.push(voice);
    voice.osc.start(0);
  }

  /* remove that voice and stop the osc */
  removeVoice(index) {
    let voice = this.voices[index];
    voice.env.endEnvelope();
    this.voices.splice(index, 1);
    voice.osc.stop(this.audioCtx.currentTime+voice.env.release+0.5);
  }

  /* setter */

  setPolyphony(bool) {
    this.polyphone = bool;
  }

  setParam(param, value) {
    // set all params via string
    let index = param.lastIndexOf('.');
    let splitParam = [param.substring(0, index), param.substring(index+1)];
    for (let voice of this.voices) {
      this.getParam(splitParam[0], voice)[splitParam[1]] = value;
    }
    let templateParam = this.getParam(splitParam[0]);
    if (templateParam) {
      templateParam[splitParam[1]] = value;
    }
    let optionParam = this.getParam(splitParam[0], this.params);
    if (optionParam) {
      optionParam[splitParam[1]] = value;
    }
  }

  /* getter */

  getAmountOfVoices() {
    return this.voices.length;
  }

  getParam(string, osc = this.template) {
    let keys = string.split('.');
    let value = osc;
    for (let key of keys) {
      value = value[key];
    }
    return value;
  }
}