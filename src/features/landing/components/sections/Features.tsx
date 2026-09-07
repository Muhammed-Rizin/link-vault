"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, Link2, Layout, Smartphone, Command } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background border-t border-border/80">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-2xl font-bold md:text-4xl tracking-tight text-foreground">
            Intelligence by default.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-sm md:text-base font-normal">
            Don&apos;t just bookmark. Understand. LinkVault uses AI to categorize and summarize
            your research automatically.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-5xl mx-auto"
        >
          {/* Feature 1: Large AI Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-8 group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
                  <Zap className="size-5" />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">AI auto-enrichment</h3>
                <p className="max-w-md text-muted-foreground text-xs md:text-sm leading-relaxed font-normal">
                  Paste any URL and watch as Gemini AI automatically extracts web metadata, generates concise key summaries, and suggests category tags.
                </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-border/80 bg-background/80 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold">
                    <Link2 className="size-4" />
                  </div>
                  <div className="h-2.5 w-36 rounded bg-muted-foreground/30"></div>
                  <div className="ml-auto flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="size-1.5 rounded-full bg-muted-foreground/40" />
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-muted-foreground/20"></div>
                  <div className="h-2 w-3/4 rounded bg-muted-foreground/20"></div>
                  <div className="h-2 w-1/2 rounded bg-muted-foreground/30"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Small Grid Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-4 group rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted text-foreground font-bold border border-border/60">
              <Layout className="size-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">Dynamic view modes</h3>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Switch effortlessly between Rich Grid View and Compact List View. Organize items with drag-and-drop priority sorting.
            </p>
          </motion.div>

          {/* Feature 3: Small PWA Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-4 group rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted text-foreground font-bold border border-border/60">
              <Smartphone className="size-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">Native PWA support</h3>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Add Link Vault to your home screen or desktop. Instant offline access, pull-to-refresh, and lightning fast navigation.
            </p>
          </motion.div>

          {/* Feature 4: Medium Command Card */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-8 group rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="flex-1">
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted text-foreground font-bold border border-border/60">
                <Command className="size-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">Keyboard shortcuts</h3>
              <p className="text-muted-foreground leading-relaxed text-xs">
                Built for speed. Press{" "}
                <kbd className="bg-muted px-1.5 py-0.5 rounded-md border border-border/80 inline-flex mx-0.5 text-[10px] font-mono text-foreground font-bold">
                  ⌘K
                </kbd>{" "}
                to search or{" "}
                <kbd className="bg-muted px-1.5 py-0.5 rounded-md border border-border/80 inline-flex mx-0.5 text-[10px] font-mono text-foreground font-bold">
                  ⌘N
                </kbd>{" "}
                to add a new link immediately.
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-background border border-border/80 p-4 font-mono text-xs text-muted-foreground shadow-inner">
              <div className="mb-2 flex gap-2">
                <span className="text-primary font-bold">$</span>
                <span className="typing-cursor text-foreground font-semibold">vault search &quot;nextjs&quot;</span>
              </div>
              <div className="space-y-1 opacity-80 text-[11px]">
                <div>&gt; Found 12 research links</div>
                <div className="text-foreground/80">&gt; Filtered by &quot;Architecture&quot;</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
