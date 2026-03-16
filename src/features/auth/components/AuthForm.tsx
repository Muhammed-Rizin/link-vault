"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Mail, User, X, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { createClient as createSupabaseClient } from "@/shared/services/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Logo } from "@/shared/components/ui/logo";

type AuthMode = "login" | "signup";
type OAuthProvider = "google" | "github";

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
      router.push("/links");
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
    <Card className="border-border/80 bg-card w-full max-w-md shadow-2xl">
      <CardHeader className="pb-3 px-8 pt-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-4">
            <div className="mt-1 p-2 rounded-lg border border-border/80 bg-background/40">
              <Logo iconClassName="size-7" showText={false} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-balance text-xl font-bold tracking-tight">
                {isSignup ? "Create Vault" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="mt-1 text-sm font-medium">
                {isSignup
                  ? "Join high-signal web research."
                  : "Access your digital second brain."}
              </CardDescription>
            </div>
          </div>
          {onCancel && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onCancel}
              aria-label="Close"
              className="rounded-full"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-10 pt-4">
        <AnimatePresence mode="wait">
          <motion.form
            key={currentMode}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isSignup && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-background/40 pl-9 border-border/80 h-11"
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
                className="bg-background/40 pl-9 border-border/80 h-11"
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
                className="bg-background/40 pl-9 border-border/80 h-11"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive font-bold bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-bold text-sm bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20 rounded-lg">
              {isSubmitting ? "Processing..." : isSignup ? "Create My Vault" : "Sign In to Vault"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="bg-card px-3">Instant Access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="bg-background/40 border-border/80 h-11 font-bold rounded-lg hover:bg-muted/50"
          >
            <GoogleIcon className="size-4 mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null}
            className="bg-background/40 border-border/80 h-11 font-bold rounded-lg hover:bg-muted/50"
          >
            <Github className="size-4 mr-2" />
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium pt-2">
          {isSignup ? "Already have an account?" : "New to LinkVault?"}{" "}
          <button onClick={handleToggleMode} className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border">
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
