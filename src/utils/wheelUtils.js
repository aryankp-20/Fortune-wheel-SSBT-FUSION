/**
 * utils/wheelUtils.js
 * -----------------------------------------------------------------------
 * All math for the fortune wheel lives here, isolated from rendering code:
 *   - fair (uniform) random number selection
 *   - the exact rotation angle needed to land the pointer on that number
 *
 * The wheel is divided into SEGMENT_COUNT equal slices. Segment index 0
 * (numbers[0] === 1) is drawn starting at the 12 o'clock position and slices
 * proceed clockwise. The pointer is fixed at 12 o'clock (0deg / top).
 * -----------------------------------------------------------------------
 */

export const SEGMENT_COUNT = 10;
export const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 36deg per number

/** Ordered numbers rendered on the wheel, clockwise from the top. */
export const WHEEL_NUMBERS = Array.from({ length: SEGMENT_COUNT }, (_, i) => i + 1);

/**
 * Returns a cryptographically-fair-enough, uniformly distributed integer
 * winner from 1..SEGMENT_COUNT. Uses crypto.getRandomValues when available
 * for higher-quality randomness than Math.random, with a safe fallback.
 */
export function pickFairWinner() {
  const numbers = WHEEL_NUMBERS;
  let randomFloat;

  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    randomFloat = buffer[0] / (0xffffffff + 1);
  } else {
    randomFloat = Math.random();
  }

  const index = Math.floor(randomFloat * numbers.length);
  return numbers[Math.min(index, numbers.length - 1)];
}

/**
 * Calculates the final CSS rotation (in degrees) required to stop the wheel
 * with `winningNumber` aligned under the fixed top pointer, after spinning
 * a randomized number of full rotations for visual drama.
 *
 * @param {number} winningNumber - the pre-determined fair winner (1-10)
 * @param {number} currentRotation - the wheel's current absolute rotation,
 *   so repeated spins keep accumulating rotation instead of snapping back.
 * @param {object} [options]
 * @param {number} [options.minSpins=5] - minimum full rotations
 * @param {number} [options.maxSpins=8] - maximum full rotations
 * @returns {number} the absolute target rotation in degrees
 */
export function calculateTargetRotation(winningNumber, currentRotation = 0, options = {}) {
  const { minSpins = 5, maxSpins = 8 } = options;

  const segmentIndex = WHEEL_NUMBERS.indexOf(winningNumber);
  if (segmentIndex === -1) {
    throw new Error(`Invalid winning number: ${winningNumber}`);
  }

  // Angle (from top, clockwise) where the *center* of the winning segment sits
  // in the wheel's own unrotated coordinate frame.
  const segmentCenterAngle = segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

  // A small random jitter within the segment so the pointer doesn't always
  // land dead-center (feels more organic) while staying safely inside the
  // segment bounds (avoids landing exactly on a divider line).
  const maxJitter = SEGMENT_ANGLE * 0.3;
  const jitter = (Math.random() * 2 - 1) * maxJitter;

  // To bring `segmentCenterAngle` to the top (0deg) under clockwise rotation,
  // the wheel must rotate by (360 - segmentCenterAngle) mod 360.
  const baseRotationToTop = (360 - segmentCenterAngle - jitter + 360) % 360;

  const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
  const fullSpinDegrees = randomSpins * 360;

  // Always rotate forward from the current position, never backward, so the
  // animation always feels like continued momentum across repeated spins.
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const deltaToTarget = ((baseRotationToTop - currentMod) % 360 + 360) % 360;

  return currentRotation + fullSpinDegrees + deltaToTarget;
}

/** Returns a random spin duration (seconds) within the 4-6s brief range. */
export function randomSpinDuration() {
  return 4 + Math.random() * 2; // 4s - 6s
}

/** Alternating premium color pairs for wheel segments (10 total). */
export const SEGMENT_COLORS = [
  { from: "#2fe6d8", to: "#1aa89e" }, // cyan
  { from: "#8b5cf6", to: "#5b21b6" }, // violet
  { from: "#e8489c", to: "#a3226b" }, // magenta
  { from: "#22c55e", to: "#15803d" }, // green
  { from: "#f7b733", to: "#b8790f" }, // gold
  { from: "#ff6b4a", to: "#c23a1e" }, // ember/orange
  { from: "#38bdf8", to: "#0369a1" }, // sky blue
  { from: "#a855f7", to: "#6b21a8" }, // purple
  { from: "#f472b6", to: "#be185d" }, // pink
  { from: "#facc15", to: "#a16207" }, // amber/gold 2
];
