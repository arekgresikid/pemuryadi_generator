// Lightweight Web Audio API Synthesizer for Educational Games (Zero external assets)

let audioCtx: AudioContext | null = null;
let globalMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setGameAudioMuted(muted: boolean) {
  globalMuted = muted;
}

export function isGameAudioMuted(): boolean {
  return globalMuted;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.12,
  delay: number = 0
) {
  if (globalMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startAt = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startAt);

    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  } catch {
    // Ignore audio errors when browser blocks autoplay
  }
}

export const gameAudio = {
  click: () => playTone(520, 0.06, 'sine', 0.08),
  correct: () => {
    playTone(523.25, 0.12, 'triangle', 0.12, 0);
    playTone(659.25, 0.14, 'triangle', 0.12, 0.09);
    playTone(783.99, 0.2, 'triangle', 0.14, 0.18);
  },
  wrong: () => {
    playTone(240, 0.16, 'sawtooth', 0.08, 0);
    playTone(180, 0.22, 'sawtooth', 0.08, 0.12);
  },
  win: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => playTone(n, 0.22, 'triangle', 0.14, i * 0.1));
  },
};
