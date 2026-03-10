"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Folders, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { useVault } from "@/features/vault/context/VaultContext";

interface SidebarProps {
  userEmail: string;
  userAvatarUrl: string | null;
}

function getInitials(email: string) {
  const local = email.split("@")[0] || "U";
  return local.slice(0, 2).toUpperCase();
}

export function Sidebar({ userEmail, userAvatarUrl }: SidebarProps) {
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

  const pathname = usePathname();
  const isProfile = pathname.startsWith("/profile");

  const countsByCategory = React.useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] =
        category === "All"
          ? links.length
          : links.filter((link) => link.category === category).length;
      return acc;
    }, {});
  }, [categories, links]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar/95 transition-[width] duration-300 md:flex md:flex-col",
        collapsed ? "w-[4.4rem]" : "w-72",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="grid size-8 place-items-center rounded-md border border-border/80 bg-muted/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Link Vault" className="size-4" />
          </div>
          {!collapsed && (
            <span className="truncate font-(family-name:--font-geist) text-sm font-semibold tracking-tight">
              Link Vault
            </span>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-2 py-3 border-b border-sidebar-border/50">
          <Link
            href="/"
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-sm transition-colors",
              !isProfile
                ? "border-border bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/70",
              collapsed && "justify-center px-1",
            )}
          >
            <Folders className="size-4 shrink-0" />
            {!collapsed && <span className="truncate font-medium">Vault</span>}
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {!collapsed && (
            <p className="px-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
          )}
          {categories.map((category) => {
            const active = !isProfile && category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  if (isProfile) {
                    window.location.href = "/";
                    setTimeout(() => setActiveCategory(category), 100);
                  } else {
                    setActiveCategory(category);
                  }
                }}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-sm transition-colors",
                  active
                    ? "border-border bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/70",
                  collapsed && "justify-center px-1",
                )}
              >
                <Folders className="size-4 shrink-0 opacity-70" />
                {!collapsed && (
                  <>
                    <span className="truncate">{category}</span>
                    <span className="ml-auto text-[11px] font-medium opacity-50">
                      {countsByCategory[category]}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn("rounded-xl border border-border/80 bg-card/70 p-2.5 shadow-sm", collapsed && "px-1")}
        >
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-2 rounded-lg transition-all duration-200 group",
              collapsed && "justify-center"
            )}
          >
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatarUrl}
                alt=""
                className="size-8 rounded-full border border-border/80 object-cover group-hover:ring-2 group-hover:ring-primary/20"
              />
            ) : (
              <div className="grid size-8 place-items-center rounded-full border border-border/80 bg-muted text-xs font-semibold text-muted-foreground group-hover:bg-accent group-hover:text-primary transition-colors">
                {getInitials(userEmail)}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold group-hover:text-primary transition-colors">{userEmail}</p>
                <p className="text-[11px] text-muted-foreground">My Profile</p>
              </div>
            )}
          </Link>
          
          {!collapsed && (
            <div className="mt-3 pt-3 border-t border-sidebar-border/50">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="h-8 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start px-2 w-full transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>{isSigningOut ? "Signing out..." : "Logout"}</span>
              </Button>
            </div>
          )}
          {collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleLogout}
              disabled={isSigningOut}
              className="mt-2 w-full h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
