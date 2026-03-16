"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Globe } from "lucide-react";

export function ModernStack() {
  return (
    <section id="workflow" className="py-8 md:py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] border border-white/5 bg-card/40 p-8 md:p-16 overflow-hidden relative backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row gap-20 items-center relative z-10">
            <div className="flex-1">
              <h2 className="mb-8 text-4xl font-black md:text-5xl lg:text-7xl tracking-tighter">
                Built for the <br /> modern stack.
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Supabase Backend",
                    desc: "Enterprise-grade real-time database and secure auth.",
                  },
                  {
                    title: "Next.js Framework",
                    desc: "Optimized for speed with Server Components and Turbo.",
                  },
                  {
                    title: "Gemini 1.5 Integration",
                    desc: "State-of-the-art AI for deep content understanding.",
                  },
                  {
                    title: "Tailwind CSS Architecture",
                    desc: "Next-gen styling for beautiful, consistent interfaces.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1 size-8 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/20 transition-all duration-300">
                      <CheckCircle2 className="size-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white/90 text-lg tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative aspect-square max-w-md w-full">
              <div className="h-full w-full rounded-[3rem] bg-black/40 overflow-hidden flex items-center justify-center p-12 border border-white/5 shadow-inner backdrop-blur-md">
                <Globe className="size-48 text-primary animate-pulse opacity-20" />
                <div className="absolute inset-0 bg-transparent pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
