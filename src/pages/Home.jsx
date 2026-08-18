import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WheelSection from "../components/WheelSection";
import HistoryBoard from "../components/HistoryBoard";
import TasksSection from "../components/TasksSection";
import { loadHistory } from "../utils/storage";

const NAV_LINKS = [
  { href: "#wheel", label: "Spin", icon: "🎡" },
  { href: "#history", label: "History", icon: "📜" },
  { href: "#tasks", label: "Tasks", icon: "📋" },
];

export default function Home() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-bold text-void-950"
            style={{ background: "linear-gradient(135deg, #2fe6d8, #8b5cf6, #e8489c)" }}
            aria-hidden="true"
          >
            SF
          </div>
          <div>
            <p className="font-display text-sm font-bold leading-tight tracking-wide">SSBT FUSION</p>
            <p className="text-[11px] leading-tight text-white/40">Fortune Wheel Challenge</p>
          </div>
        </div>

        <nav aria-label="Section navigation" className="hidden gap-1 rounded-full border border-white/10 bg-white/5 p-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true" className="mr-1.5">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <motion.div
        className="mx-auto mt-6 mb-14 max-w-2xl text-center sm:mt-10 sm:mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow mx-auto">Season One · Live Now</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
          Spin. Land a number.
          <br />
          <span className="text-gradient">Take on the challenge.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-white/60">
          One wheel, ten fates. Enter your name, give it a spin, and see which
          SSBT Fusion task lands in your lap.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="flex flex-col gap-10 sm:gap-14">
        <WheelSection onHistoryUpdate={setHistory} />
        <HistoryBoard history={history} onClear={setHistory} />
        <TasksSection />
      </div>

      <footer className="mt-20 text-center text-xs text-white/30">
        SSBT Fusion © {new Date().getFullYear()} — Fortune Wheel Challenge
      </footer>
    </div>
  );
}
