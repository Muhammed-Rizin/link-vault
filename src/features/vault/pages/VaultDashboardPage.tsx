"use client";

import * as React from "react";
import { VaultProvider, useVault } from "@/features/vault/context/VaultContext";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Header } from "@/shared/components/layout/Header";
import { VaultGrid } from "@/features/vault/components/VaultGrid";
import { VaultLinkForm } from "@/features/vault/components/VaultLinkForm";
import { VaultDeleteDialog } from "@/features/vault/components/VaultDeleteDialog";
import { VaultDetailsModal } from "@/features/vault/components/VaultDetailsModal";
import { PullToRefresh } from "@/shared/components/ui/PullToRefresh";
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
      <PullToRefresh onRefresh={() => window.location.reload()} />
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
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
