"use client";

import * as React from "react";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { LandingHeader } from "./LandingHeader";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { ModernStack } from "./sections/ModernStack";
import { CTA } from "./sections/CTA";
import { Footer } from "./sections/Footer";

export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 selection:text-white overflow-x-hidden">
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode={authMode}
      />

      <LandingHeader 
        isLoggedIn={isLoggedIn} 
        onOpenLogin={() => openAuth("login")} 
        onOpenSignup={() => openAuth("signup")} 
      />

      <main>
        <Hero 
          isLoggedIn={isLoggedIn} 
          onOpenSignup={() => openAuth("signup")} 
        />

        <Features />

        <ModernStack />

        <CTA 
          isLoggedIn={isLoggedIn} 
          onOpenSignup={() => openAuth("signup")} 
        />
      </main>

      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .typing-cursor::after {
          content: "|";
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
