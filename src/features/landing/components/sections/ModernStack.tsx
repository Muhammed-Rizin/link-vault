"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layers } from "lucide-react";

export function ModernStack() {
  return (
    <section id="workflow" className="py-16 md:py-24 bg-[#0a0a0a] border-t border-[#262626]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-lg border border-[#262626] bg-[#141414] p-6 md:p-12 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="mb-6 text-2xl font-bold md:text-4xl tracking-tight text-white">
                Built for the modern stack.
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Supabase backend",
                    desc: "Enterprise-grade real-time database and secure authentication.",
                  },
                  {
                    title: "Next.js framework",
                    desc: "Optimized for speed with Server Components and Turbo compilation.",
                  },
                  {
                    title: "Gemini AI integration",
                    desc: "State-of-the-art AI for deep web content understanding and key summaries.",
                  },
                  {
                    title: "Tailwind CSS architecture",
                    desc: "Utility-first styling for fast, consistent corporate interfaces.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-0.5 size-6 shrink-0 rounded bg-[#262626] flex items-center justify-center border border-[#3f3f46]">
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs md:text-sm">
                        {item.title}
                      </h4>
                      <p className="text-zinc-400 text-xs leading-relaxed font-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative aspect-square max-w-sm w-full">
              <div className="h-full w-full rounded-lg bg-[#0a0a0a] border border-[#262626] p-8 flex flex-col items-center justify-center text-center">
                <div className="size-16 rounded-md bg-[#262626] text-white grid place-items-center mb-4">
                  <Layers className="size-8 text-zinc-300" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Production architecture</h3>
                <p className="text-xs text-zinc-400 font-normal">High performance web intelligence layer.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
