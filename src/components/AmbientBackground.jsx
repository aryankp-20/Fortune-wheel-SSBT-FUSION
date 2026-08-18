import React, { useMemo } from "react";

/**
 * AmbientBackground
 * -----------------------------------------------------------------------
 * Purely decorative, fixed, non-interactive backdrop: a faint reactor-grid,
 * soft floating light orbs, and drifting particles. Kept as one component
 * so the "premium atmosphere" treatment lives in a single place.
 * `aria-hidden` throughout since it carries no information.
 * -----------------------------------------------------------------------
 */
export default function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Faint reactor grid */}
      <div
        className="absolute inset-0 opacity-40 bg-reactor-grid"
        style={{ backgroundSize: "48px 48px" }}
      />

      {/* Floating glow orbs */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fusion-violet/20 blur-[100px] animate-float" />
      <div
        className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-fusion-cyan/15 blur-[110px] animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-fusion-magenta/15 blur-[100px] animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Drifting particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-fusion-cyan/60"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            filter: "blur(0.5px)",
            animation: `particleRise ${p.duration}s linear ${p.delay}s infinite`,
            // custom property consumed by the injected keyframes below
            ["--drift"]: `${p.drift}px`,
          }}
        />
      ))}

      <style>{`
        @keyframes particleRise {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.4; }
          100% { transform: translate(var(--drift), -110vh); opacity: 0; }
        }
      `}</style>

      {/* Vignette to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/40 via-transparent to-void-950/70" />
    </div>
  );
}
