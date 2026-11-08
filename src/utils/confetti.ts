import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
    });
  } catch (e) {
    // Ignore if canvas isn't supported
  }
}

export function fireBigCelebration() {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // Ignore
  }
}
