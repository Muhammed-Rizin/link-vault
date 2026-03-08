"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Github, Lock, Mail, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"

type AuthMode = "login" | "signup"
type OAuthProvider = "google" | "github"

type AuthFormProps = {
  mode: AuthMode
}

const formVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

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
      <path
        d="M6.42 13.9a6 6 0 0 1 0-3.8V7.5H3.06a10 10 0 0 0 0 8.98l3.36-2.58Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.96 2.94 14.69 2 12 2A10 10 0 0 0 3.06 7.5l3.36 2.6C7.2 7.76 9.4 6 12 6Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function getOAuthRedirectTo() {
  if (typeof window === "undefined") {
    return "http://localhost:3000/auth/callback"
  }
  return `${window.location.origin}/auth/callback`
}

export function AuthForm({ mode }: AuthFormProps) {
  const [currentMode, setCurrentMode] = React.useState<AuthMode>(mode)
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState<OAuthProvider | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const router = useRouter()
  const supabase = React.useMemo(() => createSupabaseClient(), [])

  React.useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  React.useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        router.replace("/")
      }
    })

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const handleOAuth = async (provider: OAuthProvider) => {
    setError(null)
    setNotice(null)
    setOauthLoading(provider)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getOAuthRedirectTo(),
      },
    })

    setOauthLoading(null)

    if (oauthError) {
      setError(oauthError.message)
    }
  }

  const handleToggleMode = () => {
    const nextMode: AuthMode = currentMode === "login" ? "signup" : "login"
    setCurrentMode(nextMode)
    setError(null)
    setNotice(null)
    setPassword("")
    router.push(nextMode === "login" ? "/login" : "/signup")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)

    if (currentMode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      setIsSubmitting(false)

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push("/")
      router.refresh()
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: getOAuthRedirectTo(),
      },
    })

    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push("/")
      router.refresh()
      return
    }

    setNotice("Account created. Check your email to confirm before signing in.")
  }

  const isSignup = currentMode === "signup"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/85 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className={`h-1 w-full ${isSignup ? "bg-primary/70" : "bg-muted-foreground/50"}`} aria-hidden />
      <div className="space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            Elite Developer Access
          </p>
          <h1 className="font-[family-name:var(--font-geist)] text-2xl font-semibold tracking-tight text-foreground">
            {isSignup ? "Create Your Vault Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Start managing high-signal links with professional workflows."
              : "Sign in to continue building your Link Vault."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={currentMode}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isSignup && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="border-input/80 bg-background/80 pl-9 text-foreground placeholder:text-muted-foreground"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border-input/80 bg-background/80 pl-9 text-foreground placeholder:text-muted-foreground"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="border-input/80 bg-background/80 pl-9 text-foreground placeholder:text-muted-foreground"
                  placeholder={isSignup ? "Create a strong password" : "Your password"}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-foreground">{notice}</p>}

            <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
              {isSubmitting
                ? isSignup
                  ? "Creating account..."
                  : "Signing in..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
              <ArrowRight />
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 tracking-wide text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="h-10 border-border bg-background/70 text-foreground hover:bg-accent"
          >
            <GoogleIcon className="size-4" />
            {oauthLoading === "google" ? "Connecting..." : "Google"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null}
            className="h-10 border-border bg-background/70 text-foreground hover:bg-accent"
          >
            <Github />
            {oauthLoading === "github" ? "Connecting..." : "GitHub"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={handleToggleMode}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </motion.div>
  )
}
