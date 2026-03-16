"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface HeroProps {
  isLoggedIn: boolean;
  onOpenSignup: () => void;
}

export function Hero({ isLoggedIn, onOpenSignup }: HeroProps) {
  return (
    <section className="relative pt-20 pb-10 md:pt-40 md:pb-16 overflow-hidden">
      <div className="container relative mx-auto px-6 sm:px-10 text-center">
        <div className="relative z-10 max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 font-black text-4xl leading-[1.1] sm:text-6xl md:text-8xl tracking-tighter"
          >
            Professional <br />
            <span className="bg-linear-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent italic">
              Bookmarking.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-base text-white/50 leading-relaxed md:text-xl font-medium"
          >
            The intelligence layer for your web research. Save links, generate AI summaries, and
            build your digital second brain with state-of-the-art workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row mb-12"
          >
            <Button
              size="lg"
              className="h-14 rounded-2xl px-10 text-lg font-bold shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group"
              onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
            >
              {isLoggedIn ? "Back to Vault" : "Create My Vault"}
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center gap-3 text-sm text-white/30 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <CheckCircle2 className="size-4" />
                <span>Enterprise Grade</span>
              </div>
              <span className="hidden sm:inline opacity-20">|</span>
              <div className="flex items-center gap-1.5 text-blue-400/80 hover:text-blue-400 transition-colors">
                <Globe className="size-4" />
                <span>Cloud Optimized</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
