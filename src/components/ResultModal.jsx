import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

/**
 * ResultModal
 * -----------------------------------------------------------------------
 * Celebratory popup shown after a spin settles. Fires a confetti burst on
 * mount and traps focus on its close button for keyboard accessibility.
 *
 * Props:
 *   result: { playerName, number, task: { title, description } } | null
 *   onClose: () => void
 * -----------------------------------------------------------------------
 */
export default function ResultModal({ result, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!result) return;

    closeButtonRef.current?.focus();

    const duration = 1600;
    const end = Date.now() + duration;
    const colors = ["#2fe6d8", "#8b5cf6", "#e8489c", "#f7b733", "#22c55e"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.5 },
      colors,
      startVelocity: 45,
      scalar: 1.05,
    });

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result, onClose]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-void-950/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="glass-panel relative w-full max-w-md overflow-hidden p-8 text-center sm:p-10"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fusion-cyan/10 via-transparent to-fusion-magenta/10" />

            <div className="relative">
              <span className="eyebrow mx-auto mb-4">Result Locked In</span>

              <h2
                id="result-modal-title"
                className="text-gradient font-display text-3xl font-bold sm:text-4xl"
              >
                Congratulations!
              </h2>

              <p className="mt-3 text-lg text-white/80">
                <span className="font-semibold text-white">{result.playerName}</span> landed on
              </p>

              <div className="my-6 flex items-center justify-center">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full font-display text-5xl font-bold text-void-950"
                  style={{
                    background: "radial-gradient(circle at 35% 30%, #fef9e7, #f7b733 40%, #e8489c 100%)",
                    boxShadow: "0 0 50px -6px rgba(247,183,51,0.7)",
                  }}
                >
                  {result.number}
                </div>
              </div>

              <div className="glass-card p-5 text-left">
                <p className="mb-1 font-mono text-xs uppercase tracking-widest text-fusion-cyan">
                  Your Task
                </p>
                <h3 className="font-display text-lg font-semibold text-white">
                  {result.task.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {result.task.description}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="btn-primary mt-8 w-full"
              >
                Awesome, close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
