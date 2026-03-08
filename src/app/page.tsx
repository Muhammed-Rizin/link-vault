import { redirect } from "next/navigation"

import { VaultDashboard } from "@/components/dashboard/vault-dashboard"
import { type VaultLink } from "@/lib/supabase"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"

const validStatuses = new Set(["Backlog", "Researching", "Completed", "Important"])

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("vault_links")
    .select("id, title, url, source_url, category, status, summary, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch vault links", error.message)
  }

  const safeLinks: VaultLink[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    url: row.url,
    source_url: row.source_url,
    category: row.category,
    status: validStatuses.has(row.status) ? row.status : "Backlog",
    summary: row.summary,
    created_at: row.created_at,
  }))

  return (
    <VaultDashboard
      initialLinks={safeLinks}
      userEmail={user.email ?? "researcher@link-vault.dev"}
      userAvatarUrl={typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null}
    />
  )
}
