"use client";

import * as React from "react";
import { VaultProvider, useVault } from "../context/VaultContext";
import { VaultSidebar } from "../components/VaultSidebar";
import { VaultHeader } from "../components/VaultHeader";
import { VaultGrid } from "../components/VaultGrid";
import { VaultLinkForm } from "../components/VaultLinkForm";
import { VaultDeleteDialog } from "../components/VaultDeleteDialog";
import { VaultDetailsModal } from "../components/VaultDetailsModal";
import type { VaultLink } from "@/shared/services/supabase";

interface VaultDashboardPageProps {
  initialLinks: VaultLink[];
  userEmail: string;
  userAvatarUrl: string | null;
}

function VaultDashboardContent({ userEmail, userAvatarUrl }: { userEmail: string; userAvatarUrl: string | null }) {
  const { selectedLink, setSelectedLink } = useVault();

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full overflow-hidden">
        <VaultSidebar userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <VaultHeader />
          <VaultGrid />
        </div>
      </div>

      <VaultDetailsModal link={selectedLink} onClose={() => setSelectedLink(null)} />
      <VaultLinkForm />
      <VaultDeleteDialog />
    </div>
  );
}

export function VaultDashboardPage({ initialLinks, userEmail, userAvatarUrl }: VaultDashboardPageProps) {
  return (
    <VaultProvider initialLinks={initialLinks}>
      <VaultDashboardContent userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
    </VaultProvider>
  );
}
