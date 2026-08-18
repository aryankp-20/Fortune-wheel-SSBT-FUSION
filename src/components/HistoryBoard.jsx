import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clearHistory } from "../utils/storage";

/**
 * HistoryBoard
 * -----------------------------------------------------------------------
 * Displays every recorded spin, newest first — a table on wider screens,
 * a stack of cards on mobile. Clearing requires a confirmation dialog so
 * records can't be wiped by accident.
 *
 * Props:
 *   history: SpinRecord[]
 *   onClear: (records) => void — called with the (empty) array after clearing
 * -----------------------------------------------------------------------
 */
export default function HistoryBoard({ history, onClear }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmClear = () => {
    const cleared = clearHistory();
    onClear?.(cleared);
    setConfirmOpen(false);
  };

  return (
    <section
      id="history"
      aria-labelledby="history-heading"
      className="glass-panel px-6 py-10 sm:px-10 sm:py-14"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow mb-4">
            <span aria-hidden="true">📜</span> History Board
          </span>
          <h2 id="history-heading" className="font-display text-2xl font-bold sm:text-3xl">
            Every spin, on record.
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={history.length === 0}
          className="rounded-full border border-fusion-ember/40 bg-fusion-ember/10 px-5 py-2.5 text-sm
            font-semibold text-fusion-ember transition-colors duration-200 hover:bg-fusion-ember/20
            disabled:cursor-not-allowed disabled:opacity-30"
        >
          Clear History
        </button>
      </div>

      {history.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-2 py-14 text-center">
          <span className="text-3xl" aria-hidden="true">
            🗒️
          </span>
          <p className="text-white/60">No spins recorded yet — give the wheel a try!</p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 sm:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/[0.06] text-xs uppercase tracking-widest text-white/50">
                  <th scope="col" className="px-6 py-4 font-medium">Player Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Number</th>
                  <th scope="col" className="px-6 py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {history.map((record) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-white/5 transition-colors hover:bg-white/[0.04]"
                    >
                      <td className="px-6 py-4 font-medium text-white">{record.playerName}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full
                            bg-gradient-to-br from-fusion-cyan to-fusion-violet font-display text-sm font-bold text-void-950"
                        >
                          {record.number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">{record.date}</td>
                      <td className="px-6 py-4 font-mono text-sm text-white/60">{record.time}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <ul className="flex flex-col gap-3 sm:hidden">
            <AnimatePresence initial={false}>
              {history.map((record) => (
                <motion.li
                  key={record.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                        bg-gradient-to-br from-fusion-cyan to-fusion-violet font-display text-base font-bold text-void-950"
                    >
                      {record.number}
                    </span>
                    <div>
                      <p className="font-medium text-white">{record.playerName}</p>
                      <p className="text-xs text-white/50">
                        {record.date} · {record.time}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-clear-title"
          >
            <motion.div
              className="absolute inset-0 bg-void-950/80 backdrop-blur-sm"
              onClick={() => setConfirmOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel relative w-full max-w-sm p-7 text-center"
            >
              <h3 id="confirm-clear-title" className="font-display text-xl font-bold text-white">
                Clear all history?
              </h3>
              <p className="mt-2 text-sm text-white/60">
                This will permanently delete all {history.length} recorded spin
                {history.length === 1 ? "" : "s"}. This can't be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 rounded-full border border-white/15 bg-white/5 py-2.5 text-sm
                    font-semibold text-white/80 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="flex-1 rounded-full bg-fusion-ember py-2.5 text-sm font-semibold text-void-950
                    transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
