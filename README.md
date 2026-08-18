# SSBT Fusion — Fortune Wheel Challenge

A premium, glassmorphic spin-the-wheel web app built with React, Vite, Tailwind CSS,
and Framer Motion.

## Features

- 🎡 **Fair fortune wheel** — 10 equal segments, mathematically fair random selection,
  4–6s ease-out spin animation, ticking + win chime sound effects (synthesized, no audio files).
- 📋 **Tasks** — all 10 tasks driven entirely by `src/data/tasks.js`. Edit that one file
  to change every task shown across the app.
- 📜 **History Board** — every spin is saved to `localStorage`, newest first, with a
  responsive table (desktop) / card list (mobile), and a "Clear History" button with
  a confirmation dialog.
- ✅ Player name validation (required, no spaces-only, ≤30 characters, auto-trimmed).
- 🎉 Animated result popup with confetti.
- ♿ Keyboard accessible (Enter/Space to spin, focus states, ARIA labels, reduced-motion support).
- 📱 Fully responsive from 320px to 1920px, no horizontal scroll.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                  Root component
  pages/
    Home.jsx                Page layout: hero + all three sections
  components/
    AmbientBackground.jsx   Decorative particles / gradients
    PlayerInput.jsx         Name field + validation logic
    FortuneWheel.jsx        The wheel, pointer, and spin button
    ResultModal.jsx         Confetti result popup
    WheelSection.jsx        Wires PlayerInput + FortuneWheel + ResultModal
    HistoryBoard.jsx        Spin history table/cards + clear-history dialog
    TasksSection.jsx        Renders all tasks from data/tasks.js
  data/
    tasks.js                 <-- Edit this file to change task content
  utils/
    storage.js               localStorage read/write for history
    wheelUtils.js             Fair random pick + rotation math
    sound.js                  Synthesized tick/chime sound effects
```

## Customizing tasks

Open `src/data/tasks.js` and edit the `title` / `description` for each `number` (1–10).
No other file needs to change — every component (`TasksSection`, `ResultModal`) reads
from this file automatically.
