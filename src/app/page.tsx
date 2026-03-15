import { redirect } from "next/navigation";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { createClient as createSupabaseServerClient } from "@/shared/services/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/links")
  }

  return <LandingPage isLoggedIn={!!user} />
}
