import * as React from "react";
import { Link2, Globe, Github } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface LinkedIdentitiesProps {
  isConnected: (provider: string) => boolean;
}

export function LinkedIdentities({ isConnected }: LinkedIdentitiesProps) {
  return (
    <div className="pt-6 border-t border-border/40">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Link2 className="size-4 text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Linked Identities</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={cn(
          "flex items-center justify-between p-4 rounded-xl border border-border/60 bg-background/20 transition-all group",
          isConnected('google') && "ring-1 ring-primary/20 bg-primary/2"
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
          isConnected('github') && "ring-1 ring-primary/20 bg-primary/2"
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
  );
}
