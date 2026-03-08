"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Folders, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { useVault } from "../context/VaultContext";

interface VaultSidebarProps {
  userEmail: string;
  userAvatarUrl: string | null;
}

function getInitials(email: string) {
  const local = email.split("@")[0] || "U";
  return local.slice(0, 2).toUpperCase();
}

export function VaultSidebar({ userEmail, userAvatarUrl }: VaultSidebarProps) {
  const {
    collapsedSidebar: collapsed,
    setCollapsedSidebar: setCollapsed,
    categories,
    activeCategory,
    setActiveCategory,
    handleLogout,
    isSigningOut,
    links,
  } = useVault();

  const countsByCategory = React.useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] =
        category === "All" ? links.length : links.filter((link) => link.category === category).length;
      return acc;
    }, {});
  }, [categories, links]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar/95 transition-[width] duration-300 md:flex md:flex-col",
        collapsed ? "w-[4.4rem]" : "w-72"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="grid size-8 place-items-center rounded-md border border-border/80 bg-muted/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Link Vault" className="size-4" />
          </div>
          {!collapsed && (
            <span className="truncate font-(family-name:--font-geist) text-sm font-semibold tracking-tight">Link Vault</span>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3">
        {!collapsed && <p className="px-2 text-xs text-muted-foreground uppercase">Categories</p>}
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-sm",
                active
                  ? "border-border bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/70",
                collapsed && "justify-center px-1"
              )}
            >
              <Folders className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{category}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {countsByCategory[category]}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "rounded-xl border border-border/80 bg-card/70 p-2.5",
            collapsed && "text-center"
          )}
        >
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatarUrl}
                alt=""
                className="size-8 rounded-full border border-border/80 object-cover"
              />
            ) : (
              <div className="grid size-8 place-items-center rounded-full border border-border/80 bg-muted text-xs font-semibold text-muted-foreground">
                {getInitials(userEmail)}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">Research Profile</p>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size={collapsed ? "icon-sm" : "sm"}
            onClick={handleLogout}
            disabled={isSigningOut}
            className="mt-2 w-full border-border/80 bg-transparent"
          >
            <LogOut />
            {!collapsed && (isSigningOut ? "Signing out..." : "Logout")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
