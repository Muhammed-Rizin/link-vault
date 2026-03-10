import { redirect } from "next/navigation";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { createClient } from "@/shared/services/supabase/server";

export default async function ProfileRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfilePage 
      userEmail={user.email ?? "researcher@link-vault.dev"} 
      userAvatarUrl={typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null} 
    />
  );
}
