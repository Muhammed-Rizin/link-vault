import * as React from "react";
import { User, Mail, AtSign, Briefcase, MapPin, Save, Camera, UserCircle } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  headline: string;
  location: string;
  avatarUrl: string;
}

interface PersonaFormProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PersonaForm({ formData, setFormData, isSaving, onSubmit }: PersonaFormProps) {
  return (
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

        <form onSubmit={onSubmit} className="space-y-6">
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
      </CardContent>
    </Card>
  );
}
