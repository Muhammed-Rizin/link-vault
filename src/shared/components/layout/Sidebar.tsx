"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Folders, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { useVault } from "@/features/vault/context/VaultContext";
import { sortCategories } from "@/features/vault/services/category.service";

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

  const sortedCategories = React.useMemo(() => {
    return sortCategories(categories);
  }, [categories]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-[width] duration-300 md:flex md:flex-col",
        collapsed ? "w-[4.5rem]" : "w-72",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Link Vault" className="size-4.5" />
          </div>
          {!collapsed && (
            <span className="truncate text-base font-bold tracking-tight text-foreground">
              Link Vault
            </span>
          )}
        </div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg text-muted-foreground hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-3 py-3 border-b border-sidebar-border/50">
          <Link
            href="/"
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-semibold transition-all",
              !isProfile
                ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center px-1",
            )}
          >
            <Folders className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">All Vault Items</span>}
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
          )}
          {sortedCategories.map((category) => {
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
                  "flex h-9.5 items-center gap-3 rounded-lg border border-transparent px-3 text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  collapsed && "justify-center px-1",
                )}
              >
                <Folders className={cn("size-4 shrink-0", active ? "opacity-100" : "opacity-60")} />
                {!collapsed && (
                  <>
                    <span className="truncate">{category}</span>
                    <span
                      className={cn(
                        "ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {countsByCategory[category] ?? 0}
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
          className={cn(
            "rounded-2xl border border-border/80 bg-card/60 p-3 shadow-sm",
            collapsed && "px-1.5",
          )}
        >
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg transition-all duration-200 group",
              collapsed && "justify-center",
            )}
          >
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatarUrl}
                alt=""
                className="size-8.5 rounded-full border border-border/80 object-cover group-hover:ring-2 group-hover:ring-primary/40"
              />
            ) : (
              <div className="grid size-8.5 place-items-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary transition-colors">
                {getInitials(userEmail)}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {userEmail}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground">My Account</p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <div className="mt-3 pt-2.5 border-t border-sidebar-border/50">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="h-8 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start px-2 w-full transition-colors rounded-lg font-semibold text-xs"
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
              className="mt-2 w-full h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
