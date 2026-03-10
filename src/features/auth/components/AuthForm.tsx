"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { createClient as createSupabaseClient } from "@/shared/services/supabase/client";

type AuthMode = "login" | "signup";
type OAuthProvider = "google" | "github";

type AuthFormProps = {
  mode: AuthMode;
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

export function AuthForm({ mode }: AuthFormProps) {
  const [currentMode, setCurrentMode] = React.useState<AuthMode>(mode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<OAuthProvider | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseClient(), []);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleOAuth = async (provider: OAuthProvider) => {
    setError(null);
    setOauthLoading(provider);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setOauthLoading(null);
    if (oauthError) setError(oauthError.message);
  };

  const handleToggleMode = () => {
    const nextMode: AuthMode = currentMode === "login" ? "signup" : "login";
    setCurrentMode(nextMode);
    setError(null);
    router.push(nextMode === "login" ? "/login" : "/signup");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (currentMode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsSubmitting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsSubmitting(false);
        return;
      }
      alert("Check your email for confirmation!");
      setIsSubmitting(false);
    }
  };

  const isSignup = currentMode === "signup";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/85 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className={`h-1 w-full ${isSignup ? "bg-primary" : "bg-muted-foreground/30"}`} />
      <div className="space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Intelligence Access
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isSignup ? "Create Your Vault" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Start managing high-signal links with enterprise workflows."
              : "Sign in to continue your research."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={currentMode}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isSignup && (
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/50 pl-9"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 pl-9"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-destructive font-medium">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full font-bold">
              {isSubmitting ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="bg-card px-2">Social Auth</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="bg-background/50"
          >
            <GoogleIcon className="size-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null}
            className="bg-background/50"
          >
            <Github className="size-4 mr-2" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <button onClick={handleToggleMode} className="font-bold text-foreground hover:underline">
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
