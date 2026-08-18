import React, { useState, useCallback } from "react";
import PlayerInput, { validatePlayerName } from "./PlayerInput";
import FortuneWheel from "./FortuneWheel";
import ResultModal from "./ResultModal";
import { getTaskByNumber } from "../data/tasks";
import { addHistoryRecord } from "../utils/storage";

/**
 * WheelSection
 * -----------------------------------------------------------------------
 * Owns the player-name state, gates the wheel until a valid name is
 * entered, and reacts to spin completion by looking up the task, saving
 * a history record, and opening the result popup.
 *
 * Props:
 *   onHistoryUpdate: (records) => void — bubbles fresh history up to Home
 * -----------------------------------------------------------------------
 */
export default function WheelSection({ onHistoryUpdate }) {
  const [playerName, setPlayerName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const { valid: nameIsValid, trimmed: trimmedName } = validatePlayerName(playerName);

  const handleSpinEnd = useCallback(
    (winningNumber) => {
      const task = getTaskByNumber(winningNumber);
      const history = addHistoryRecord({ playerName: trimmedName, number: winningNumber });
      onHistoryUpdate?.(history);
      setResult({ playerName: trimmedName, number: winningNumber, task });
      setIsSpinning(false);
    },
    [trimmedName, onHistoryUpdate]
  );

  return (
    <section
      id="wheel"
      aria-labelledby="wheel-heading"
      className="glass-panel px-6 py-10 sm:px-10 sm:py-14"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="eyebrow mb-4">
          <span aria-hidden="true">🎡</span> Spin the Wheel
        </span>
        <h2 id="wheel-heading" className="font-display text-3xl font-bold sm:text-4xl">
          Spin the wheel for your number —{" "}
          <span className="text-gradient">every number has different tasks.</span>
        </h2>
        <p className="mt-4 max-w-xl text-white/60">
          Enter your name, hit spin, and see which of the ten SSBT Fusion challenges
          you've been dealt.
        </p>

        <div className="mt-10 flex justify-center">
          <PlayerInput value={playerName} onChange={setPlayerName} disabled={isSpinning} />
        </div>

        <div className="mt-10">
          <FortuneWheel
            canSpin={nameIsValid && !isSpinning}
            onSpinStart={() => setIsSpinning(true)}
            onSpinEnd={handleSpinEnd}
          />
        </div>
      </div>

      <ResultModal result={result} onClose={() => setResult(null)} />
    </section>
  );
}
