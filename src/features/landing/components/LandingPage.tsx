"use client";

import { motion } from "framer-motion";
import { ArrowRight, Link2, Zap, Layout, Smartphone, Github, CheckCircle2, Globe, Command } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const floatingAnimation = (delay: number) => ({
  y: [0, -15, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay
  }
});

export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 -z-10 bg-[#050505]">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] opacity-50 translate-x-[-20%] translate-y-[-20%]"></div>
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] opacity-50 translate-x-[20%] translate-y-[20%]"></div>
      </div>

      {/* Navigation - Minimalist */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
              <Link2 className="size-5" />
            </div>
            <span>LinkVault</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">Features</a>
            <a href="#workflow" className="hover:text-primary transition-colors cursor-pointer">Workflow</a>
            <a href="https://github.com/Muhammed-Rizin/link-vault" className="hover:text-primary transition-colors cursor-pointer">Open Source</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-white/70 hover:text-white" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20" asChild>
              <Link href={isLoggedIn ? "/links" : "/signup"}>
                {isLoggedIn ? "Dashboard" : "Get Started"}
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 px-4 text-xs font-semibold uppercase tracking-widest text-primary/80 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Powered by Gemini 1.5 Pro
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="mx-auto mb-8 max-w-5xl text-6xl font-black tracking-tight leading-[1.05] sm:text-7xl md:text-8xl lg:text-9xl">
              Knowledge <br />
              <span className="bg-gradient-to-r from-primary via-white to-blue-400 bg-clip-text text-transparent italic">Organized.</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-white/60 leading-relaxed md:text-xl"
          >
            The bookmarking tool for heavy researchers. Save links, generate AI summaries, and build your digital second brain with ease.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Button size="lg" className="h-14 rounded-2xl px-10 text-lg font-bold shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group" asChild>
              <Link href={isLoggedIn ? "/links" : "/signup"}>
                {isLoggedIn ? "Back to Vault" : "Start your Vault"}
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <div className="flex items-center gap-3 text-sm text-white/40">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="size-8 rounded-full border-2 border-black bg-muted/50 overflow-hidden ring-2 ring-white/5">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Joined by 2k+ developers this week</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Interactive Elements */}
        <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none opacity-40">
          <motion.div animate={floatingAnimation(0)} className="absolute top-[20%] left-[15%] text-7xl select-none">🔮</motion.div>
          <motion.div animate={floatingAnimation(1)} className="absolute top-[30%] right-[10%] text-6xl select-none">🧠</motion.div>
          <motion.div animate={floatingAnimation(2)} className="absolute bottom-[20%] left-[25%] text-5xl select-none">⚡</motion.div>
          <motion.div animate={floatingAnimation(1.5)} className="absolute bottom-[30%] right-[20%] text-7xl select-none">💎</motion.div>
        </div>
      </section>

      {/* Social Proof / Partners */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-20 px-10 items-center justify-center opacity-30">
              {['Vercel', 'Supabase', 'GitHub', 'Google Cloud', 'Tailwind', 'Next.js', 'Framer'].map(brand => (
                <span key={brand} className="text-xl font-bold tracking-tighter">{brand}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="mb-4 text-4xl font-black md:text-5xl lg:text-6xl">Supercharged workflow.</h2>
            <p className="mx-auto max-w-xl text-white/50 text-lg">Stop losing links. Start building knowledge with our advanced toolset.</p>
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
              className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-10 hover:border-primary/50 transition-colors"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-black">
                    <Zap className="size-7" />
                  </div>
                  <h3 className="mb-4 text-3xl font-black">AI-Powered Enrichment</h3>
                  <p className="max-w-md text-white/60 text-lg leading-relaxed">
                    Paste any URL and watch as Gemini AI automatically extracts metadata, generates concise summaries, and suggests categories.
                  </p>
                </div>
                <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Link2 className="size-5 text-primary" />
                    </div>
                    <div className="h-4 w-48 rounded bg-white/10"></div>
                    <div className="ml-auto flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="size-2 rounded-full bg-white/10"></div>)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full rounded bg-white/5"></div>
                    <div className="h-2 w-3/4 rounded bg-white/5"></div>
                    <div className="h-2 w-1/2 rounded bg-white/5 opacity-50"></div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-primary/10 border border-primary/20"></div>
                    <div className="h-6 w-24 rounded-full bg-blue-500/10 border border-blue-500/20"></div>
                  </div>
                </div>
              </div>
              {/* Decorative radial gradient */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
            </motion.div>

            {/* Feature 2: Small Grid Card */}
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-4 group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 hover:bg-white/[0.08] transition-colors"
            >
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                <Layout className="size-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Infinite Sections</h3>
              <p className="text-white/50 leading-relaxed">
                Organize links into customizable categories. Use our smart status pipeline: Backlog, Research, and Completed.
              </p>
            </motion.div>

            {/* Feature 3: Small PWA Card */}
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-4 group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 hover:bg-white/[0.08] transition-colors"
            >
              <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                <Smartphone className="size-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Native PWA</h3>
              <p className="text-white/50 leading-relaxed">
                Add Link Vault to your home screen for an app-like experience. Fast, responsive, and ready whenever you are.
              </p>
            </motion.div>

            {/* Feature 4: Medium Command Card */}
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-8 group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 flex flex-col md:flex-row gap-10 hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex-1">
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
                  <Command className="size-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Quick Actions</h3>
                <p className="text-white/50 leading-relaxed">
                  Keyboard-first interface designed for power users. Slash commands, instant search, and bulk operations.
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 font-mono text-xs text-white/40">
                <div className="mb-4 flex gap-2">
                  <span className="text-primary">$</span>
                  <span className="typing-cursor">vault search &quot;nextjs&quot;</span>
                </div>
                <div className="space-y-2 opacity-60">
                  <div>&gt; Found 12 results</div>
                  <div className="text-blue-400">&gt; Filtering by &quot;Research&quot;</div>
                  <div>&gt; 3 items highlighted</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature List / Comparison */}
      <section id="workflow" className="py-24 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-8 text-4xl font-black md:text-5xl">Built for the <br /> modern stack.</h2>
              <div className="space-y-6">
                {[
                  { title: "Supabase Backend", desc: "Enterprise-grade real-time database and secure auth." },
                  { title: "Next.js 15+ Framework", desc: "Optimized for speed with Server Components and Turbo." },
                  { title: "Gemini 1.5 Integration", desc: "State-of-the-art AI for deep content understanding." },
                  { title: "Tailwind CSS v4", desc: "Next-gen styling for beautiful, consistent interfaces." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 size-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                      <CheckCircle2 className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white/90">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-auto h-[400px] rounded-[3rem] bg-gradient-to-tr from-primary/20 via-blue-500/10 to-transparent p-px"
            >
              <div className="h-full w-full rounded-[3rem] bg-[#050505] overflow-hidden flex items-center justify-center p-12">
                <Globe className="size-48 text-primary animate-pulse opacity-50" />
                <div className="absolute inset-0 bg-transparent pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-40">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[3rem] bg-foreground p-12 py-24 md:p-24 text-center text-background shadow-2xl">
            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-8 text-5xl font-black md:text-7xl lg:text-8xl tracking-tighter"
              >
                Start building your <br /> vault today.
              </motion.h2>
              <p className="mb-12 text-xl opacity-70 font-medium">No credit card required. Free forever for individuals.</p>
              <Button size="lg" variant="secondary" className="h-16 rounded-2xl px-12 text-xl font-black hover:scale-105 transition-transform" asChild>
                <Link href={isLoggedIn ? "/links" : "/signup"}>
                  {isLoggedIn ? "Access Dashboard" : "Get Started Now"}
                </Link>
              </Button>
            </div>
            {/* Abstract Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 rounded-full size-[500px] bg-primary blur-[100px]"></div>
              <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 rounded-full size-[500px] bg-blue-500 blur-[100px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="border-t border-white/5 py-20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 font-black text-2xl mb-6 tracking-tight">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-black">
                  <Link2 className="size-6" />
                </div>
                LinkVault
              </div>
              <p className="text-white/40 max-w-xs leading-relaxed">
                The intelligence layer for your bookmarks. Save what matters, let AI handle the rest.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary/80">Product</h5>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary/80">Company</h5>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em]">All Systems Operational</p>
            </div>
            <p className="text-xs text-white/20 uppercase tracking-widest">© 2026 Link Vault Inc. All rights reserved.</p>
            <div className="flex gap-6 opacity-30">
              <Github className="size-5 cursor-pointer hover:opacity-100" />
              <Globe className="size-5 cursor-pointer hover:opacity-100" />
            </div>
          </div>
        </div>
      </footer>

      {/* Tailwind and custom CSS animation extensions */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .typing-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
