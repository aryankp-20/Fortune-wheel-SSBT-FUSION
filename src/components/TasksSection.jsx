import React from "react";
import { motion } from "framer-motion";
import { tasks } from "../data/tasks";

/**
 * TasksSection
 * -----------------------------------------------------------------------
 * Renders every task from data/tasks.js as a glass card. Purely
 * presentational — edit data/tasks.js to change what appears here.
 * -----------------------------------------------------------------------
 */
export default function TasksSection() {
  return (
    <section
      id="tasks"
      aria-labelledby="tasks-heading"
      className="glass-panel px-6 py-10 sm:px-10 sm:py-14"
    >
      <span className="eyebrow mb-4">
        <span aria-hidden="true">📋</span> Tasks
      </span>
      <h2 id="tasks-heading" className="font-display text-2xl font-bold sm:text-3xl">
        All ten challenges, laid out.
      </h2>
      <p className="mt-3 max-w-xl text-white/60">
        Whatever the wheel decides, here's exactly what it means.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, i) => (
          <motion.article
            key={task.number}
            className="glass-card flex flex-col gap-3 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                  bg-gradient-to-br from-fusion-cyan to-fusion-violet font-display text-base font-bold text-void-950"
              >
                {task.number}
              </span>
              <h3 className="font-display text-lg font-semibold text-white">{task.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{task.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
