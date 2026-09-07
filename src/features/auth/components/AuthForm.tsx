"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Mail, User, X, Lock } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Logo } from "@/shared/components/ui/logo";
import { useAuthForm, AuthMode } from "../hooks/useAuthForm";

type AuthFormProps = {
  mode: AuthMode;
  onCancel?: () => void;
};

const formVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M21.6 12.2c0-.67-.06-1.32-.18-1.94H12v3.67h5.39a4.62 4.62 0 0 1-2 3.03v2.5h3.25c1.9-1.76 2.96-4.36 2.96-7.26Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.25-2.5c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path d="M6.42 13.9a6 6 0 0 1 0-3.8V7.5H3.06a10 10 0 0 0 0 8.98l3.36-2.58Z" fill="#FBBC05" />
      <path
        d="M12 6c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.96 2.94 14.69 2 12 2A10 10 0 0 0 3.06 7.5l3.36 2.6C7.2 7.76 9.4 6 12 6Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthForm({ mode, onCancel }: AuthFormProps) {
  const {
    currentMode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isSubmitting,
    oauthLoading,
    error,
    handleOAuth,
    handleToggleMode,
    handleSubmit,
  } = useAuthForm({ initialMode: mode });

  const isSignup = currentMode === "signup";

  return (
    <Card className="border-border/80 bg-card text-card-foreground w-full max-w-md shadow-2xl rounded-2xl overflow-hidden relative">
      {onCancel && (
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <X className="size-4" />
        </Button>
      )}

      <CardHeader className="pb-3 px-6 pt-6 border-b border-border/80 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl border border-border/80 bg-primary/10">
            <Logo iconClassName="size-8" showText={false} />
          </div>
          <div>
            <CardTitle className="text-balance text-lg font-bold tracking-tight text-foreground">
              {isSignup ? "Create vault account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="mt-1 text-xs font-normal text-muted-foreground">
              {isSignup
                ? "Join high-signal web research."
                : "Access your digital second brain."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6 pt-5">
        <AnimatePresence mode="wait">
          <motion.form
            key={currentMode}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >
            {isSignup && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-background pl-9 border-border/80 h-10 rounded-xl text-xs text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background pl-9 border-border/80 h-10 rounded-xl text-xs text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background pl-9 border-border/80 h-10 rounded-xl text-xs text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive font-semibold bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 text-center"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-10 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors shadow-md">
              {isSubmitting ? "Processing..." : isSignup ? "Create my vault" : "Sign in to vault"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="bg-card px-2">Instant access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="bg-background border-border/80 h-10 font-semibold text-xs rounded-xl hover:bg-accent text-foreground transition-colors shadow-sm"
          >
            <GoogleIcon className="size-4 mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null}
            className="bg-background border-border/80 h-10 font-semibold text-xs rounded-xl hover:bg-accent text-foreground transition-colors shadow-sm"
          >
            <Github className="size-4 mr-2" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-normal pt-1">
          {isSignup ? "Already have an account?" : "New to LinkVault?"}{" "}
          <button onClick={handleToggleMode} className="font-bold text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
