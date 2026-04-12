import { SupabaseClient } from "@supabase/supabase-js";
import { VaultLink } from "@/shared/services/supabase";

export const vaultDbService = {
  async fetchLinks(supabase: SupabaseClient): Promise<VaultLink[]> {
    const { data, error } = await supabase
      .from("vault_links")
      .select("id, title, url, source_url, category, status, summary, created_at, youtube_id, position")
      .order("position", { ascending: true });

    if (error) throw error;
    return (data as VaultLink[]) || [];
  },

  async createLink(supabase: SupabaseClient, link: Partial<VaultLink>): Promise<VaultLink> {
    const { data, error } = await supabase
      .from("vault_links")
      .insert(link)
      .select("id, title, url, source_url, category, status, summary, created_at, youtube_id, position")
      .single();

    if (error) throw error;
    return data as VaultLink;
  },

  async updateLink(supabase: SupabaseClient, id: string, updates: Partial<VaultLink>): Promise<VaultLink> {
    const { data, error } = await supabase
      .from("vault_links")
      .update(updates)
      .eq("id", id)
      .select("id, title, url, source_url, category, status, summary, created_at, youtube_id, position")
      .single();

    if (error) throw error;
    return data as VaultLink;
  },

  async deleteLink(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase.from("vault_links").delete().eq("id", id);
    if (error) throw error;
  },

  async updatePosition(supabase: SupabaseClient, id: string, position: number): Promise<void> {
    const { error } = await supabase
      .from("vault_links")
      .update({ position })
      .eq("id", id);
    
    if (error) throw error;
  }
};
