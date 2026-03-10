"use client";

import * as React from "react";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Settings2,
  Cpu,
  Loader2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { aiConfigService, AIConfiguration as AIConfigType } from "../services/ai-config.service";

export type AIProvider = {
  id: string;
  name: string;
  logo: string;
  models: string[];
};

export const PROVIDERS: AIProvider[] = [
  { 
    id: "google", 
    name: "Google AI Studio", 
    logo: "https://www.gstatic.com/lamda/images/favicon_v1_150160d1398251cc47c2.png",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"] 
  },
  { 
    id: "openai", 
    name: "OpenAI", 
    logo: "https://openai.com/favicon.ico",
    models: ["gpt-4o", "gpt-4o-mini", "o1-preview"] 
  },
  { 
    id: "anthropic", 
    name: "Anthropic", 
    logo: "https://www.anthropic.com/favicon.ico",
    models: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"] 
  }
];

export function APIConfiguration() {
  const [configurations, setConfigurations] = React.useState<AIConfigType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [activeProvider, setActiveProvider] = React.useState<AIProvider | null>(null);
  
  const [newConfig, setNewConfig] = React.useState({
    providerId: "",
    model: "",
    apiKey: ""
  });

  const loadConfigs = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await aiConfigService.getConfigurations();
      setConfigurations(data);
    } catch (err) {
      console.error("Failed to load configs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleAddConfig = async () => {
    if (!newConfig.providerId || !newConfig.model || !newConfig.apiKey) return;
    
    try {
      await aiConfigService.saveConfiguration({
        provider_id: newConfig.providerId,
        model_id: newConfig.model,
        api_key: newConfig.apiKey,
        is_active: configurations.length === 0
      });
      await loadConfigs();
      setNewConfig({ providerId: "", model: "", apiKey: "" });
      setIsAdding(false);
      setActiveProvider(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await aiConfigService.toggleActive(id);
      await loadConfigs();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const removeConfig = async (id: string) => {
    try {
      await aiConfigService.deleteConfiguration(id);
      await loadConfigs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card/50 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Settings2 className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold uppercase tracking-tight">API Intelligence Registry</CardTitle>
                <CardDescription className="text-[11px] font-medium">Manage your private AI providers and active research models.</CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => setIsAdding(true)} 
              size="sm" 
              className="rounded-xl gap-2 font-bold"
              disabled={isAdding || loading}
            >
              <Plus className="size-4" />
              Add Provider
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : isAdding ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Provider</label>
                    <select 
                      className="w-full bg-background border border-border/60 rounded-xl h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={newConfig.providerId}
                      onChange={(e) => {
                        const p = PROVIDERS.find(p => p.id === e.target.value);
                        setActiveProvider(p || null);
                        setNewConfig({ ...newConfig, providerId: e.target.value, model: p?.models[0] || "" });
                      }}
                    >
                      <option value="">Choose a provider...</option>
                      {PROVIDERS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Model</label>
                    <select 
                      className="w-full bg-background border border-border/60 rounded-xl h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                      disabled={!activeProvider}
                      value={newConfig.model}
                      onChange={(e) => setNewConfig({ ...newConfig, model: e.target.value })}
                    >
                      {activeProvider?.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      )) || <option>Select provider first</option>}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">API Secret Key</label>
                    <Input 
                      type="password"
                      placeholder="sk-..."
                      className="bg-background border-border/60 rounded-xl h-10"
                      value={newConfig.apiKey}
                      onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleAddConfig} className="rounded-xl font-bold px-8">Save Configuration</Button>
                </div>
              </motion.div>
            ) : configurations.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 rounded-xl bg-muted/30 text-muted-foreground ring-1 ring-border/40">
                  <ShieldCheck className="size-10 opacity-20" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground/50">No API Keys Registered</p>
                  <p className="text-[11px] text-muted-foreground max-w-[280px] font-medium leading-relaxed">
                    Add your own AI provider keys to enable high-throughput link enrichment and custom intelligence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {configurations.map((config) => {
                  const provider = PROVIDERS.find(p => p.id === config.provider_id);
                  return (
                    <div 
                      key={config.id}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                        config.is_active 
                          ? "border-primary/50 bg-primary/[0.03] ring-1 ring-primary/20 shadow-lg shadow-primary/5" 
                          : "border-border/60 bg-background/40 hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="size-12 rounded-xl bg-background border border-border/60 flex items-center justify-center overflow-hidden p-2 shadow-inner">
                            {provider?.logo ? (
                              <img src={provider.logo} alt="" className="size-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              <Cpu className="size-5 text-muted-foreground" />
                            )}
                          </div>
                          {config.is_active && (
                            <div className="absolute -top-1.5 -right-1.5 size-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-background scale-110">
                              <CheckCircle2 className="size-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground">{provider?.name}</p>
                            <span className="text-[9px] font-black uppercase tracking-tighter bg-muted px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">
                              {config.model_id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-[10px] text-muted-foreground font-mono opacity-60">••••••••••••••••</code>
                            {config.is_active && (
                              <>
                                <span className="size-1 rounded-full bg-border" />
                                <p className="text-[10px] text-muted-foreground font-medium italic">Active for enrichment</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!config.is_active && (
                          <Button 
                            variant="secondary" 
                            size="xs" 
                            onClick={() => toggleActive(config.id)}
                            className="rounded-lg font-bold text-[10px] uppercase tracking-wider"
                          >
                            Set Active
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon-xs" 
                          onClick={() => removeConfig(config.id)}
                          className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/60 bg-muted/5 p-4 rounded-2xl">
          <div className="flex gap-4 items-start">
            <div className="size-8 rounded-lg bg-background border border-border/80 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-tight">Security Protocol</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Your API keys are stored securely in Supabase and only accessible via your authenticated session.</p>
            </div>
          </div>
        </Card>
        <Card className="border-border/60 bg-muted/5 p-4 rounded-2xl">
          <div className="flex gap-4 items-start">
            <div className="size-8 rounded-lg bg-background border border-border/80 flex items-center justify-center shrink-0">
              <Cpu className="size-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-tight">System Usage</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">The active model will be used for all background link enrichment and intelligence tasks.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
