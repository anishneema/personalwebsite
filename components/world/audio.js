// Procedural footstep sound via the Web Audio API — no audio files.
// A soft, low click: a short sine "thud" plus a touch of filtered noise.
export function createFootsteps() {
  let ctx = null;

  const ensureCtx = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  // Call once on a user gesture so the context is allowed to start.
  const unlock = () => { ensureCtx(); };

  const step = () => {
    const ac = ensureCtx();
    if (!ac) return;
    const now = ac.currentTime;

    // Low sine thud.
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    // A small filtered noise burst for "texture".
    const dur = 0.05;
    const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const nGain = ac.createGain();
    nGain.gain.setValueAtTime(0.06, now);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    noise.connect(filter).connect(nGain).connect(ac.destination);
    noise.start(now);
    noise.stop(now + dur);
  };

  const dispose = () => {
    if (ctx) ctx.close();
    ctx = null;
  };

  return { step, unlock, dispose };
}
