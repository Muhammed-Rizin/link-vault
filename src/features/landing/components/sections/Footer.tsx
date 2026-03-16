"use client";

import * as React from "react";
import { Github, Globe } from "lucide-react";
import { Logo } from "@/shared/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="md:col-span-2">
            <Logo className="mb-6" iconClassName="size-8" />
            <p className="text-white/40 max-w-xs leading-relaxed text-sm font-medium">
              The high-performance intelligence layer for your web research. Save what matters,
              automate the rest.
            </p>
          </div>
          <div className="flex flex-wrap gap-20">
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-primary/80">
                Platform
              </h5>
              <ul className="space-y-4 text-white/60 text-sm font-semibold">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="hover:text-primary transition-colors">
                    Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Muhammed-Rizin/link-vault"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-primary/80">
                Legal
              </h5>
              <ul className="space-y-4 text-white/60 text-sm font-semibold">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              All Systems Operational
            </p>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
            © 2026 Link Vault Inc. Managed with AI.
          </p>
          <div className="flex gap-6 opacity-30">
            <a
              href="https://github.com/Muhammed-Rizin/link-vault"
              className="hover:opacity-100 transition-opacity"
            >
              <Github className="size-5" />
            </a>
            <Globe className="size-5 cursor-pointer hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
}
