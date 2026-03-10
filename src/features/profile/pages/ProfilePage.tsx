"use client";

import * as React from "react";
import { 
  User, 
  Mail, 
  Save, 
  UserCircle, 
  Cpu, 
  Link2,
  ChevronRight,
  Github,
  Globe,
  Camera,
  MapPin,
  AtSign,
  Briefcase
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { createClient as createSupabaseBrowserClient } from "@/shared/services/supabase/client";
import { cn } from "@/shared/utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Header } from "@/shared/components/layout/Header";
import { VaultProvider } from "@/features/vault/context/VaultContext";
import { APIConfiguration } from "../components/APIConfiguration";

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
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    headline: "",
    location: "",
    avatarUrl: ""
  });
  const [identities, setIdentities] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const supabase = createSupabaseBrowserClient();

  React.useEffect(() => {
    async function loadUser() {
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
    }
    loadUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          username: formData.username,
          headline: formData.headline,
          location: formData.location
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isConnected = (provider: string) => 
    identities.some(identity => identity.provider === provider);

  return (
    <VaultProvider initialLinks={[]}>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <div className="flex h-full w-full overflow-hidden">
          <Sidebar userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-(family-name:--font-geist) font-bold text-foreground sm:text-2xl">
                    Account Management
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Configure your research persona and system integration parameters.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8 md:flex-row items-start">
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                  <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      activeTab === "general" 
                        ? "bg-accent text-accent-foreground shadow-sm" 
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
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      activeTab === "apis" 
                        ? "bg-accent text-accent-foreground shadow-sm" 
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
                        <Card className="border-border/80 bg-card/50">
                          <CardHeader className="border-b border-border/40 pb-4 bg-muted/10">
                            <CardTitle className="text-base font-bold uppercase tracking-tight">Public Persona</CardTitle>
                            <CardDescription className="text-[11px] font-medium">Define how you appear within the research ecosystem.</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6 space-y-8">
                            <div className="flex items-center gap-6">
                              <div className="relative group">
                                <div className="size-20 rounded-2xl bg-muted border border-border/60 flex items-center justify-center overflow-hidden shadow-inner">
                                  {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Avatar" className="size-full object-cover" />
                                  ) : (
                                    <UserCircle className="size-10 text-muted-foreground/40" />
                                  )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-background border border-border shadow-lg text-primary hover:scale-110 transition-transform">
                                  <Camera className="size-3.5" />
                                </button>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold">{formData.fullName || "Researcher"}</p>
                                <p className="text-xs text-muted-foreground font-(family-name:--font-geist-mono)">@{formData.username}</p>
                              </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">Display Name</label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                      value={formData.fullName}
                                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                      placeholder="Muhammed Rizin"
                                      className="bg-background/40 border-border/60 pl-10 h-10 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">Unique Username</label>
                                  <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                      value={formData.username}
                                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                                      placeholder="rizin"
                                      className="bg-background/40 border-border/60 pl-10 h-10 rounded-xl font-(family-name:--font-geist-mono)"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">Professional Headline</label>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                      value={formData.headline}
                                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                                      placeholder="Senior Software Engineer & Researcher"
                                      className="bg-background/40 border-border/60 pl-10 h-10 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">Research Node Location</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                    <Input
                                      value={formData.location}
                                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                                      placeholder="Dubai, UAE"
                                      className="bg-background/40 border-border/60 pl-10 h-10 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">System Email</label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                                    <Input
                                      value={formData.email}
                                      disabled
                                      className="bg-muted/30 border-border/40 pl-10 h-10 cursor-not-allowed opacity-80 rounded-xl font-(family-name:--font-geist-mono) text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSaving} className="gap-2 px-8 h-10 rounded-xl font-bold transition-all active:scale-95 shadow-lg">
                                  <Save className="size-4" />
                                  {isSaving ? "Syncing..." : "Update Persona"}
                                </Button>
                              </div>
                            </form>

                            <div className="pt-6 border-t border-border/40">
                              <div className="flex items-center gap-2 mb-4 px-1">
                                <Link2 className="size-4 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Linked Identities</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={cn(
                                  "flex items-center justify-between p-4 rounded-xl border border-border/60 bg-background/20 transition-all group",
                                  isConnected('google') && "ring-1 ring-primary/20 bg-primary/[0.02]"
                                )}>
                                  <div className="flex items-center gap-4">
                                    <div className="grid size-10 place-items-center rounded-lg bg-background border border-border/60 shadow-sm group-hover:scale-105 transition-transform">
                                      <Globe className="size-5 text-[#4285F4]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold">Google</p>
                                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{isConnected('google') ? 'Verified' : 'Available'}</p>
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                                    isConnected('google') ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : "bg-muted text-muted-foreground/60"
                                  )}>
                                    {isConnected('google') ? 'Active' : 'Offline'}
                                  </div>
                                </div>

                                <div className={cn(
                                  "flex items-center justify-between p-4 rounded-xl border border-border/60 bg-background/20 transition-all group",
                                  isConnected('github') && "ring-1 ring-primary/20 bg-primary/[0.02]"
                                )}>
                                  <div className="flex items-center gap-4">
                                    <div className="grid size-10 place-items-center rounded-lg bg-background border border-border/60 shadow-sm group-hover:scale-105 transition-transform">
                                      <Github className="size-5 text-foreground" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold">GitHub</p>
                                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{isConnected('github') ? 'Linked' : 'Available'}</p>
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                                    isConnected('github') ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : "bg-muted text-muted-foreground/60"
                                  )}>
                                    {isConnected('github') ? 'Active' : 'Offline'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
