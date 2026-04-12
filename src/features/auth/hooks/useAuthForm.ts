import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/shared/services/supabase/client";

export type AuthMode = "login" | "signup";
export type OAuthProvider = "google" | "github";

interface UseAuthFormProps {
  initialMode: AuthMode;
}

export function useAuthForm({ initialMode }: UseAuthFormProps) {
  const [currentMode, setCurrentMode] = React.useState<AuthMode>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<OAuthProvider | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseClient(), []);

  const handleOAuth = async (provider: OAuthProvider) => {
    setError(null);
    setOauthLoading(provider);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(null);
    }
    // Redirect happens automatically for successful OAuth
  };

  const handleToggleMode = () => {
    setCurrentMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (currentMode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;
        
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

        if (signUpError) throw signUpError;
        
        alert("Check your email for confirmation!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
