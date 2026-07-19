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
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#0a0a0a]">
      <div className="container relative mx-auto px-6 sm:px-10 text-center">
        <div className="relative z-10 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-3.5 py-1 text-xs font-medium text-zinc-300 mb-6"
          >
            <Sparkles className="size-3 text-zinc-400" />
            <span>AI-powered link management system</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 font-bold text-4xl leading-tight sm:text-5xl md:text-6xl tracking-tight text-white"
          >
            Professional bookmarking <br className="hidden sm:inline" />
            and web research.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-sm text-zinc-400 leading-relaxed md:text-base font-normal"
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
              className="h-11 rounded-md px-6 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors group"
              onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
            >
              {isLoggedIn ? "Back to vault" : "Create my vault free"}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Instant auto-enrich</span>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Globe className="size-4 text-zinc-400" />
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
          className="relative max-w-5xl mx-auto rounded-lg border border-[#262626] bg-[#141414] p-4 sm:p-5 text-left overflow-hidden"
        >
          {/* Mockup Window Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-zinc-600" />
              <div className="size-2.5 rounded-full bg-zinc-600" />
              <div className="size-2.5 rounded-full bg-zinc-600" />
              <span className="ml-2 text-xs font-mono text-zinc-400">linkvault.dev/dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-[#1c1c1c] border border-[#262626] px-2 py-0.5 rounded">
                <Command className="size-3" /> K
              </div>
              <div className="size-6 rounded bg-[#262626] text-white grid place-items-center">
                <LayoutGrid className="size-3.5" />
              </div>
            </div>
          </div>

          {/* Mockup Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-300 bg-[#262626] px-2 py-0.5 rounded">
                  AI & ML
                </span>
                <span className="text-[10px] text-zinc-500">github.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white line-clamp-1">Awesome LLM architectures</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">Curated list of production-ready Large Language Model serving pipelines.</p>
              </div>
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Completed</span>
                <ExternalLink className="size-3 text-zinc-500" />
              </div>
            </div>

            {/* Card 2 - Youtube */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <Youtube className="size-3" /> Video
                </span>
                <span className="text-[10px] text-zinc-500">youtube.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white line-clamp-1">Next.js 15 full architecture guide</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">Deep dive into Server Actions, Turbopack, and Cache Control.</p>
              </div>
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">Researching</span>
                <ExternalLink className="size-3 text-zinc-500" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                  Design
                </span>
                <span className="text-[10px] text-zinc-500">figma.com</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white line-clamp-1">Design systems 2026 toolkit</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">Component design tokens, accessibility specs, and clean UI patterns.</p>
              </div>
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">Backlog</span>
                <ExternalLink className="size-3 text-zinc-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
