export { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"

export type VaultStatus = "Backlog" | "Researching" | "Completed" | "Important"

export type VaultLink = {
  id: string
  title: string
  url: string
  source_url: string
  category: string
  status: VaultStatus
  summary: string | null
  created_at: string
}
