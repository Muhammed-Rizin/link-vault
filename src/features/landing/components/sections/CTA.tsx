"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";

interface CTAProps {
  isLoggedIn: boolean;
  onOpenSignup: () => void;
}

function Star({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function CTA({ isLoggedIn, onOpenSignup }: CTAProps) {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0a0a0a] border-t border-[#262626]">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto relative overflow-hidden rounded-lg border border-[#262626] bg-[#141414] p-8 py-16 text-center"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl tracking-tight leading-none text-white">
              Build your vault today.
            </h2>
            <p className="mb-8 text-sm text-zinc-400 font-normal">
              Capture high-value web links. Simplify your research workflow with AI intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="default"
                className="h-11 rounded-md px-8 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
                onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
              >
                {isLoggedIn ? "Access vault dashboard" : "Get started free"}
              </Button>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Star className="size-3.5 text-zinc-400 fill-zinc-400" />
                <span>Free for personal research</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
