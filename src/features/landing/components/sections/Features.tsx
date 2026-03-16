"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, Link2, Layout, Smartphone, Command } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function Features() {
  return (
    <section id="features" className="py-8 md:py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-black md:text-5xl lg:text-7xl tracking-tighter">
            Intelligence by default.
          </h2>
          <p className="mx-auto max-w-xl text-white/40 text-base md:text-lg font-medium">
            Don&apos;t just bookmark. Understand. LinkVault uses AI to categorize and summarize
            your research automatically.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Feature 1: Large AI Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/40 p-10 hover:border-white/10 transition-all backdrop-blur-sm"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-black">
                  <Zap className="size-7" />
                </div>
                <h3 className="mb-4 text-3xl font-black tracking-tight">AI-Powered Enrichment</h3>
                <p className="max-w-md text-white/60 text-lg leading-relaxed font-medium">
                  Paste any URL and watch as Gemini AI automatically extracts metadata, generates
                  concise summaries, and suggests categories.
                </p>
              </div>
              <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Link2 className="size-5 text-primary" />
                  </div>
                  <div className="h-4 w-48 rounded bg-white/10"></div>
                  <div className="ml-auto flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="size-2 rounded-full bg-white/10"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full rounded bg-white/5"></div>
                  <div className="h-2 w-3/4 rounded bg-white/5"></div>
                  <div className="h-2 w-1/2 rounded bg-white/5 opacity-50"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Small Grid Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-4 group rounded-[2.5rem] border border-white/5 bg-card/40 p-10 hover:border-white/10 transition-all backdrop-blur-sm"
          >
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
              <Layout className="size-7" />
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Infinite Sections</h3>
            <p className="text-white/50 leading-relaxed font-medium">
              Organize links into customizable categories. Use our smart status pipeline: Backlog,
              Research, and Completed.
            </p>
          </motion.div>

          {/* Feature 3: Small PWA Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-4 group rounded-[2.5rem] border border-white/5 bg-card/40 p-10 hover:border-white/10 transition-all backdrop-blur-sm"
          >
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
              <Smartphone className="size-7" />
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Native PWA</h3>
            <p className="text-white/50 leading-relaxed font-medium">
              Add Link Vault to your home screen for an app-like experience. Fast, responsive, and
              ready whenever you are.
            </p>
          </motion.div>

          {/* Feature 4: Medium Command Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-8 group rounded-[2.5rem] border border-white/5 bg-card/40 p-10 flex flex-col md:flex-row gap-10 hover:border-white/10 transition-all backdrop-blur-sm"
          >
            <div className="flex-1">
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
                <Command className="size-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight">Quick Workflow</h3>
              <p className="text-white/50 leading-relaxed font-medium">
                Keyboard-first interface designed for speed. <br />
                Use{" "}
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 inline-flex mx-1 text-[10px] font-mono font-bold">
                  ⌘K
                </kbd>{" "}
                to search or{" "}
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 inline-flex mx-1 text-[10px] font-mono font-bold">
                  ⌘L
                </kbd>{" "}
                to add.
              </p>
            </div>
            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 font-mono text-xs text-white/40 shadow-inner">
              <div className="mb-4 flex gap-2">
                <span className="text-primary font-bold">$</span>
                <span className="typing-cursor">vault search &quot;nextjs&quot;</span>
              </div>
              <div className="space-y-2 opacity-60 font-medium">
                <div>&gt; Found 12 results</div>
                <div className="text-blue-400">&gt; Filtering by &quot;Research&quot;</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
