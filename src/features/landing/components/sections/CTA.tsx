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
    <section className="py-10 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4rem] border border-white/5 bg-card/60 p-12 py-24 text-center backdrop-blur-3xl shadow-2xl"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="mb-8 text-5xl font-black md:text-7xl lg:text-9xl tracking-tighter leading-none">
              Build your <span className="text-primary italic">Vault</span> <br /> today.
            </h2>
            <p className="mb-12 text-xl text-white/50 font-medium tracking-tight">
              Capture the web. Simplify your research life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="h-16 rounded-2xl px-12 text-xl font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]"
                onClick={() =>
                  isLoggedIn ? (window.location.href = "/links") : onOpenSignup()
                }
              >
                {isLoggedIn ? "Access Dashboard" : "Get Started Now"}
              </Button>
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Star className="size-3.5 text-primary fill-primary/40" />
                <span>Free forever for individuals</span>
              </div>
            </div>
          </div>

          {/* Background decorative glow */}
          <div className="absolute -bottom-20 -left-20 size-80 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="absolute -top-20 -right-20 size-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
}
