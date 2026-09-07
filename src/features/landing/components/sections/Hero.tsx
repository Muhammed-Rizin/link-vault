"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Command, ExternalLink, Globe, LayoutGrid, Sparkles, Youtube } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface HeroProps {
  isLoggedIn: boolean;
  onOpenSignup: () => void;
}

export function Hero({ isLoggedIn, onOpenSignup }: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-background">
      <div className="container relative mx-auto px-6 sm:px-10 text-center">
        <div className="relative z-10 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-sm"
          >
            <Sparkles className="size-3 text-primary" />
            <span>AI-powered link management system</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 font-bold text-4xl leading-tight sm:text-5xl md:text-6xl tracking-tight text-foreground"
          >
            Professional bookmarking <br className="hidden sm:inline" />
            and web research.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-sm text-muted-foreground leading-relaxed md:text-base font-normal"
          >
            Save links instantly, generate AI key summaries, categorize research topics, and reorder your web intelligence pipeline with zero friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row mb-12"
          >
            <Button
              size="default"
              className="h-11 rounded-xl px-6 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all group shadow-md"
              onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
            >
              {isLoggedIn ? "Back to vault" : "Create my vault free"}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Instant auto-enrich</span>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <Globe className="size-4 text-primary" />
                <span>PWA ready</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Vault Mockup Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 text-left overflow-hidden shadow-xl"
        >
          {/* Mockup Window Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-rose-500/80" />
              <div className="size-2.5 rounded-full bg-amber-500/80" />
              <div className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">linkvault.dev/dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-muted border border-border/80 px-2 py-0.5 rounded-lg">
                <Command className="size-3" /> K
              </div>
              <div className="size-6 rounded-lg bg-primary text-primary-foreground grid place-items-center">
                <LayoutGrid className="size-3.5" />
              </div>
            </div>
          </div>

          {/* Mockup Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-foreground bg-muted border border-border/60 px-2 py-0.5 rounded-md">
                  AI & ML
                </span>
                <span className="text-[10px] text-muted-foreground">github.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">Awesome LLM architectures</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">Curated list of production-ready Large Language Model serving pipelines.</p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">Completed</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
            </div>

            {/* Card 2 - Youtube */}
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Youtube className="size-3" /> Video
                </span>
                <span className="text-[10px] text-muted-foreground">youtube.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">Next.js 15 full architecture guide</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">Deep dive into Server Actions, Turbopack, and Cache Control.</p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-sky-500 font-medium bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">Researching</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-purple-500 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                  Design
                </span>
                <span className="text-[10px] text-muted-foreground">figma.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">Design systems 2026 toolkit</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">Component design tokens, accessibility specs, and clean UI patterns.</p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-amber-500 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">Backlog</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
