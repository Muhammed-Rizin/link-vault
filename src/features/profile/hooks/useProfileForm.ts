import * as React from "react";
import { SupabaseClient } from "@supabase/supabase-js";

import { ProfileFormData } from "../components/PersonaForm";

export function useProfileForm(supabase: SupabaseClient) {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    fullName: "",
    username: "",
    email: "",
    headline: "",
    location: "",
    avatarUrl: ""
  });
  const [identities, setIdentities] = React.useState<Record<string, any>[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setFormData({
            fullName: user.user_metadata?.full_name || "",
            username: user.user_metadata?.username || user.email?.split('@')[0] || "",
            email: user.email || "",
            headline: user.user_metadata?.headline || "",
            location: user.user_metadata?.location || "",
            avatarUrl: user.user_metadata?.avatar_url || ""
          });
          setIdentities(user.identities || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          username: formData.username,
          headline: formData.headline,
          location: formData.location
        }
      });
      if (error) throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const isConnected = (provider: string) => 
    identities.some(identity => identity.provider === provider);

  return {
    formData,
    setFormData,
    identities,
    isSaving,
    isLoading,
    handleSubmit,
    isConnected
  };
}
