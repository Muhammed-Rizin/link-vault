"use client";

import * as React from "react";
import { UserCircle, Cpu, ChevronRight } from "lucide-react";
import { createClient as createSupabaseBrowserClient } from "@/shared/services/supabase/client";
import { cn } from "@/shared/utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Header } from "@/shared/components/layout/Header";
import { VaultProvider } from "@/features/vault/context/VaultContext";
import { APIConfiguration } from "../components/APIConfiguration";
import { useProfileForm } from "../hooks/useProfileForm";
import { PersonaForm } from "../components/PersonaForm";
import { LinkedIdentities } from "../components/LinkedIdentities";
import { ProfileStats } from "../components/ProfileStats";

type ProfileTab = "general" | "apis";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } as const },
};

interface ProfilePageProps {
  userEmail: string;
  userAvatarUrl: string | null;
}

export function ProfilePage({ userEmail, userAvatarUrl }: ProfilePageProps) {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>("general");
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  
  const {
    formData,
    setFormData,
    isSaving,
    handleSubmit,
    isConnected
  } = useProfileForm(supabase);

  return (
    <VaultProvider initialLinks={[]}>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <div className="flex h-full w-full overflow-hidden">
          <Sidebar userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 font-(family-name:--font-geist)">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl tracking-tight">
                    Account Management
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    Configure your research persona and system integration parameters.
                  </p>
                </div>
              </div>

              <ProfileStats totalLinks={42} totalCategories={8} />

              <div className="flex flex-col gap-8 md:flex-row items-start">
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                  <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                      activeTab === "general" 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground"
                    )}
                  >
                    <UserCircle className="size-4" />
                    <span>Research Persona</span>
                    {activeTab === "general" && <ChevronRight className="ml-auto size-3 opacity-50" />}
                  </button>

                  <button
                    onClick={() => setActiveTab("apis")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                      activeTab === "apis" 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground"
                    )}
                  >
                    <Cpu className="size-4" />
                    <span>API Intelligence</span>
                    {activeTab === "apis" && <ChevronRight className="ml-auto size-3 opacity-50" />}
                  </button>
                </aside>

                <div className="flex-1 w-full min-w-0 pb-10">
                  <AnimatePresence mode="wait">
                    {activeTab === "general" ? (
                      <motion.div 
                        key="general"
                        variants={tabVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="space-y-6"
                      >
                        <PersonaForm 
                          formData={formData}
                          setFormData={setFormData}
                          isSaving={isSaving}
                          onSubmit={handleSubmit}
                        />
                        <LinkedIdentities isConnected={isConnected} />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="apis"
                        variants={tabVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                      >
                        <APIConfiguration />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </VaultProvider>
  );
}
