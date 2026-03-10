import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { createClient } from "@/shared/services/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-md">
      <AuthForm mode="signup" />
    </div>
  );
}
