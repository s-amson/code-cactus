/* =========================================================
   sound.js - Web Audio synthesizer. Adds CC.Sound.
   ========================================================= */
(function () {
  'use strict';

  const Sound = {
    ctx: null,
    on: true,
    ensure() {
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return false;
          this.ctx = new AC();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return true;
      } catch (e) {
        return false;
      }
    },
    tone(f1, f2, dur, type = 'sine', vol = 0.15, delay = 0) {
      if (!this.on || !this.ensure()) return;
      try {
        const c = this.ctx, t = c.currentTime + delay;
        const o = c.createOscillator(), g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f1, t);
        o.frequency.exponentialRampToValueAtTime(f2, t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + dur + 0.05);
      } catch (e) {}
    },
    boing()      { this.tone(220, 520, 0.18, 'sine', 0.2); this.tone(520, 260, 0.2, 'sine', 0.15, 0.16); },
    pop()        { this.tone(700, 180, 0.12, 'triangle', 0.22); },
    hi()         { this.tone(500, 900, 0.12, 'triangle', 0.15); },
    clank()      { this.tone(180, 95, 0.14, 'square', 0.18); this.tone(420, 310, 0.12, 'triangle', 0.16, 0.08); },
    whistle()    {
      this.tone(587, 587, 0.22, 'triangle', 0.16, 0);
      this.tone(740, 740, 0.22, 'triangle', 0.14, 0);
      this.tone(587, 622, 0.35, 'triangle', 0.18, 0.26);
      this.tone(740, 784, 0.35, 'triangle', 0.15, 0.26);
    },
    crash()      { this.tone(240, 75, 0.38, 'sawtooth', 0.18); },
    fanfare()    { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, f * 1.002, 0.2, 'triangle', 0.18, i * 0.1)); },
    dayChime()   { [440, 554, 659, 880].forEach((f, i) => this.tone(f, f * 1.02, 0.22, 'sine', 0.14, i * 0.11)); },
    nightChime() { [880, 659, 554, 440].forEach((f, i) => this.tone(f, f * 0.98, 0.26, 'sine', 0.14, i * 0.12)); },
    whoosh() {
      if (!this.on || !this.ensure()) return;
      try {
        const c = this.ctx, t = c.currentTime, len = 0.7;
        const buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        src.buffer = buf;
        const f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.Q.value = 1.2;
        f.frequency.setValueAtTime(300, t);
        f.frequency.exponentialRampToValueAtTime(3200, t + len);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.25);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        src.connect(f).connect(g).connect(c.destination);
        src.start(t);
      } catch (e) {}
    }
  };

  window.CC.Sound = Sound;
})();
