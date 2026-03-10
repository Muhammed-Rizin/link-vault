import { createClient } from "@/shared/services/supabase/client";

export interface AIConfiguration {
  id: string;
  provider_id: string;
  model_id: string;
  api_key: string;
  is_active: boolean;
  created_at?: string;
}

class AIConfigService {
  private supabase = createClient();

  async getConfigurations() {
    const { data, error } = await this.supabase
      .from("user_ai_configs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data as AIConfiguration[];
  }

  async saveConfiguration(config: Omit<AIConfiguration, "id">) {
    // If setting as active, deactivate others first
    if (config.is_active) {
      await this.supabase
        .from("user_ai_configs")
        .update({ is_active: false })
        .eq("is_active", true);
    }

    const { data, error } = await this.supabase
      .from("user_ai_configs")
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data as AIConfiguration;
  }

  async toggleActive(id: string) {
    // Deactivate all
    await this.supabase
      .from("user_ai_configs")
      .update({ is_active: false })
      .neq("id", id);

    // Activate selected
    const { data, error } = await this.supabase
      .from("user_ai_configs")
      .update({ is_active: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as AIConfiguration;
  }

  async deleteConfiguration(id: string) {
    const { error } = await this.supabase
      .from("user_ai_configs")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
}

export const aiConfigService = new AIConfigService();
