import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  SEGMENT_ANGLE,
  SEGMENT_COLORS,
  WHEEL_NUMBERS,
  pickFairWinner,
  calculateTargetRotation,
  randomSpinDuration,
} from "../utils/wheelUtils";
import { playTick, playWinChime } from "../utils/sound";

const SIZE = 420; // SVG viewBox size (square)
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;

/** Converts polar (angle-from-top, clockwise) + radius to SVG x/y. */
function polarToCartesian(angleDeg, radius) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

/** Builds an SVG path `d` string for one pie-slice segment. */
function describeSegment(startAngle, endAngle) {
  const start = polarToCartesian(endAngle, RADIUS);
  const end = polarToCartesian(startAngle, RADIUS);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

/**
 * FortuneWheel
 * -----------------------------------------------------------------------
 * Renders the 10-segment wheel, the fixed top pointer, and the center
 * SPIN button. All randomness/math is delegated to utils/wheelUtils so
 * this component only handles rendering + animation orchestration.
 *
 * Props:
 *   canSpin (bool)      - whether the Spin button should be enabled
 *   onSpinStart (fn)    - called the instant a spin begins
 *   onSpinEnd (fn(number)) - called with the winning number once settled
 * -----------------------------------------------------------------------
 */
export default function FortuneWheel({ canSpin, onSpinStart, onSpinEnd }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const controls = useAnimation();
  const tickIntervalRef = useRef(null);

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  useEffect(() => stopTicking, [stopTicking]);

  const handleSpin = useCallback(async () => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    onSpinStart?.();

    const winner = pickFairWinner();
    const duration = randomSpinDuration();
    const target = calculateTargetRotation(winner, rotationRef.current);

    // Ticking sound: faster at first, this simple fixed-interval tick reads
    // well perceptually across the whole spin without extra complexity.
    tickIntervalRef.current = setInterval(() => playTick(0.08), 90);

    await controls.start({
      rotate: target,
      transition: { duration, ease: [0.12, 0.62, 0.18, 1] }, // ease-out w/ deceleration
    });

    stopTicking();
    rotationRef.current = target;
    setIsSpinning(false);
    playWinChime();
    onSpinEnd?.(winner);
  }, [isSpinning, canSpin, controls, onSpinStart, onSpinEnd, stopTicking]);

  // Keyboard accessibility: Enter triggers spin when the wheel/button has focus.
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === "Enter" || e.key === " ") && canSpin && !isSpinning) {
        e.preventDefault();
        handleSpin();
      }
    },
    [canSpin, isSpinning, handleSpin]
  );

  const spinDisabled = !canSpin || isSpinning;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative" style={{ width: "min(80vw, 380px)", height: "min(80vw, 380px)" }}>
        {/* Fixed metallic pointer — never rotates */}
        <div
          className="absolute left-1/2 top-[-14px] z-20 -translate-x-1/2"
          aria-hidden="true"
        >
          <svg width="36" height="46" viewBox="0 0 36 46" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <defs>
              <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="45%" stopColor="#f7b733" />
                <stop offset="100%" stopColor="#b8790f" />
              </linearGradient>
            </defs>
            <path
              d="M18 46 L2 14 A18 18 0 1 1 34 14 Z"
              fill="url(#pointerGradient)"
              stroke="#7a5209"
              strokeWidth="1"
            />
            <circle cx="18" cy="14" r="6" fill="#7a5209" opacity="0.25" />
          </svg>
        </div>

        {/* Outer glow ring while idle */}
        <div className="absolute inset-[-10px] rounded-full bg-gradient-to-br from-fusion-cyan/30 via-fusion-violet/20 to-fusion-magenta/30 blur-2xl animate-pulse-glow" />

        {/* The rotating wheel */}
        <motion.svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          animate={controls}
          initial={{ rotate: 0 }}
          className="relative z-10 h-full w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="Fortune wheel with numbers 1 through 10"
        >
          <defs>
            {SEGMENT_COLORS.map((c, i) => (
              <linearGradient key={i} id={`segGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={c.from} />
                <stop offset="100%" stopColor={c.to} />
              </linearGradient>
            ))}
            <radialGradient id="hubGradient" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
          </defs>

          {/* Outer rim */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 3} fill="none" stroke="#0a0d16" strokeWidth="8" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="url(#hubGradient)" strokeWidth="2" opacity="0.5" />

          {WHEEL_NUMBERS.map((num, i) => {
            const startAngle = i * SEGMENT_ANGLE;
            const endAngle = startAngle + SEGMENT_ANGLE;
            const midAngle = startAngle + SEGMENT_ANGLE / 2;
            const labelPos = polarToCartesian(midAngle, RADIUS * 0.68);

            return (
              <g key={num}>
                <path
                  d={describeSegment(startAngle, endAngle)}
                  fill={`url(#segGrad${i % SEGMENT_COLORS.length})`}
                  stroke="rgba(6,7,13,0.55)"
                  strokeWidth="2"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
                  className="select-none"
                  style={{
                    fill: "#06070d",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: SIZE * 0.075,
                    opacity: 0.92,
                  }}
                >
                  {num}
                </text>
              </g>
            );
          })}
        </motion.svg>

        {/* Center SPIN button — sits fixed above the rotating SVG */}
        <button
          type="button"
          onClick={handleSpin}
          onKeyDown={handleKeyDown}
          disabled={spinDisabled}
          aria-label={isSpinning ? "Wheel is spinning" : "Spin the wheel"}
          className={`absolute left-1/2 top-1/2 z-30 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2
            select-none flex-col items-center justify-center rounded-full font-display text-sm font-bold
            uppercase tracking-wider text-void-950 transition-transform duration-150 ease-out
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
            ${spinDisabled ? "cursor-not-allowed opacity-60 grayscale" : "hover:scale-105 active:scale-95"}`}
          style={{
            background: "radial-gradient(circle at 35% 30%, #fef9e7 0%, #f7b733 35%, #e8489c 100%)",
            boxShadow: spinDisabled
              ? "none"
              : "0 0 0 4px rgba(255,255,255,0.12), 0 8px 30px -4px rgba(247,183,51,0.65), inset 0 2px 6px rgba(255,255,255,0.5)",
          }}
        >
          {isSpinning ? (
            <span className="animate-pulse">•••</span>
          ) : (
            <span>Spin</span>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-white/40" aria-live="polite">
        {isSpinning
          ? "Spinning… good luck!"
          : canSpin
          ? "Press Spin, or focus the wheel and hit Enter."
          : "Enter your name above to unlock the wheel."}
      </p>
    </div>
  );
}
