export { createClient as createSupabaseBrowserClient } from "@/shared/services/supabase/client"

export type VaultStatus = "Backlog" | "Researching" | "Completed" | "Important"

export type VaultLink = {
  id: string;
  title: string;
  url: string;
  source_url: string | null;
  category: string;
  status: VaultStatus;
  summary: string | null;
  created_at: string;
  youtube_id?: string | null;
  position: number; // Added for drag-and-drop sorting
};
