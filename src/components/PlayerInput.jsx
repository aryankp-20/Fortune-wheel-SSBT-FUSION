import React from "react";

export const MAX_NAME_LENGTH = 30;

/**
 * Validates a player name per the challenge rules:
 *   - not empty after trimming
 *   - not spaces-only
 *   - at most MAX_NAME_LENGTH characters (after trimming)
 * @returns {{ valid: boolean, message: string, trimmed: string }}
 */
export function validatePlayerName(rawName) {
  const trimmed = (rawName || "").trim();

  if (trimmed.length === 0) {
    return { valid: false, message: "Enter your name to unlock the wheel.", trimmed };
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      message: `Names must be ${MAX_NAME_LENGTH} characters or fewer.`,
      trimmed,
    };
  }
  return { valid: true, message: "", trimmed };
}

/**
 * PlayerInput
 * -----------------------------------------------------------------------
 * Controlled text field for the contestant's name. Validation rules are
 * exposed via `validatePlayerName` so the parent (WheelSection) can decide
 * when to enable the Spin button.
 * -----------------------------------------------------------------------
 */
export default function PlayerInput({ value, onChange, disabled }) {
  const { valid, message } = validatePlayerName(value);
  const showError = value.length > 0 && !valid;

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="player-name"
        className="mb-2 block text-sm font-medium text-white/70"
      >
        Player name
      </label>
      <div className="relative">
        <input
          id="player-name"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter your name"
          maxLength={MAX_NAME_LENGTH + 10}
          autoComplete="off"
          aria-invalid={showError}
          aria-describedby="player-name-hint"
          className={`w-full rounded-2xl border bg-white/[0.06] px-5 py-3.5 text-base text-white placeholder-white/35
            backdrop-blur-xl transition-all duration-200 focus:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50
            ${showError ? "border-fusion-ember/70 focus:border-fusion-ember" : "border-white/15 focus:border-fusion-cyan/70"}`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-white/30">
          {value.trim().length}/{MAX_NAME_LENGTH}
        </span>
      </div>
      <p
        id="player-name-hint"
        className={`mt-2 min-h-[1.25rem] text-xs ${showError ? "text-fusion-ember" : "text-white/40"}`}
      >
        {showError ? message : "This name will be saved with your result."}
      </p>
    </div>
  );
}
