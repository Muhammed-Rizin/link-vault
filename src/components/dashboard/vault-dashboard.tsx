"use client"

import * as React from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Command,
  Folders,
  LogOut,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CategoryPicker } from "@/components/dashboard/category-picker"
import { LinkCard } from "@/components/dashboard/link-card"
import { LinkCardSkeleton } from "@/components/dashboard/link-card-skeleton"
import { LinkDetailsModal } from "@/components/dashboard/link-details-modal"
import { createSupabaseBrowserClient, type VaultLink } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

type VaultDashboardProps = {
  initialLinks: VaultLink[]
  userEmail: string
  userAvatarUrl: string | null
}

type FormMode = "create" | "edit"

type LinkFormState = {
  title: string
  url: string
  sourceUrl: string
  category: string
  summary: string
}

function normalizeCategory(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function sortLinksLatest(items: VaultLink[]) {
  return [...items].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  })
}

function getInitials(email: string) {
  const local = email.split("@")[0] || "U"
  return local.slice(0, 2).toUpperCase()
}

function toFormState(link?: VaultLink, fallbackCategory = "AI Coding"): LinkFormState {
  if (!link) {
    return { title: "", url: "", sourceUrl: "", category: fallbackCategory, summary: "" }
  }
  return {
    title: link.title,
    url: link.url,
    sourceUrl: link.source_url,
    category: link.category,
    summary: link.summary ?? "",
  }
}

export function VaultDashboard({ initialLinks, userEmail, userAvatarUrl }: VaultDashboardProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [query, setQuery] = React.useState("")
  const [links, setLinks] = React.useState<VaultLink[]>(() => sortLinksLatest(initialLinks))
  const [selectedLink, setSelectedLink] = React.useState<VaultLink | null>(null)
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [formMode, setFormMode] = React.useState<FormMode>("create")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formState, setFormState] = React.useState<LinkFormState>(toFormState(undefined))
  const [categoryMode, setCategoryMode] = React.useState<"existing" | "new">("existing")
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isEnriching, setIsEnriching] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  const [formError, setFormError] = React.useState<string | null>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const openCreateRef = React.useRef<() => void>(() => {})
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()

  React.useEffect(() => setLinks(sortLinksLatest(initialLinks)), [initialLinks])

  React.useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest("[data-link-menu]")) setMenuOpenId(null)
    }
    document.addEventListener("pointerdown", closeMenu)
    return () => document.removeEventListener("pointerdown", closeMenu)
  }, [])

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsInitialLoading(false), 420)
    return () => window.clearTimeout(timer)
  }, [])

  const categories = React.useMemo(() => {
    const unique = [...new Set(links.map((link) => normalizeCategory(link.category)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b)
    )
    return ["All", ...unique]
  }, [links])

  const existingCategories = React.useMemo(
    () => categories.filter((category) => category !== "All"),
    [categories]
  )

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("All")
  }, [activeCategory, categories])

  const filteredLinks = React.useMemo(() => {
    const term = query.toLowerCase().trim()
    const filtered = links.filter((link) => {
      if (activeCategory !== "All" && link.category !== activeCategory) return false
      if (!term) return true
      return (
        link.title.toLowerCase().includes(term) ||
        (link.summary ?? "").toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term) ||
        link.source_url.toLowerCase().includes(term)
      )
    })
    return sortLinksLatest(filtered)
  }, [activeCategory, links, query])

  const countsByCategory = React.useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] =
        category === "All" ? links.length : links.filter((link) => link.category === category).length
      return acc
    }, {})
  }, [categories, links])

  const resetForm = (categoryHint?: string) => {
    const fallback = categoryHint ?? categories[1] ?? "AI Coding"
    setFormState(toFormState(undefined, fallback))
    if (existingCategories.length === 0) {
      setCategoryMode("new")
      setNewCategoryName(fallback)
    } else {
      setCategoryMode("existing")
      setNewCategoryName("")
    }
    setFormMode("create")
    setEditingId(null)
    setFormError(null)
  }

  const openCreate = () => {
    const hinted = activeCategory !== "All" ? activeCategory : undefined
    resetForm(hinted)
    if (hinted && !existingCategories.includes(hinted)) {
      setCategoryMode("new")
      setNewCategoryName(hinted)
    }
    setFormOpen(true)
  }
  openCreateRef.current = openCreate

  React.useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const element = target as HTMLElement | null
      if (!element) return false
      const tagName = element.tagName
      return (
        element.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT"
      )
    }

    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchRef.current?.focus()
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault()
        if (!formOpen) openCreateRef.current()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [formOpen])

  const openEdit = (link: VaultLink) => {
    setFormMode("edit")
    setEditingId(link.id)
    setFormState(toFormState(link))
    if (existingCategories.includes(link.category)) {
      setCategoryMode("existing")
      setNewCategoryName("")
    } else {
      setCategoryMode("new")
      setNewCategoryName(link.category)
    }
    setFormError(null)
    setFormOpen(true)
    setMenuOpenId(null)
  }

  const handleAutoEnrich = async () => {
    if (!formState.url.trim()) {
      setFormError("Paste a URL first to run auto-enrichment.")
      return
    }

    setIsEnriching(true)
    setFormError(null)
    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formState.url.trim() }),
      })
      const payload = (await response.json()) as {
        title?: string | null
        summary?: string | null
        description?: string | null
      }
      if (!response.ok) throw new Error("enrich_failed")
      const title = payload.title?.trim() || null
      const summary = payload.summary?.trim() || payload.description?.trim() || null
      if (!title && !summary) {
        setFormError("No metadata was found for this URL.")
        return
      }
      setFormState((prev) => ({
        ...prev,
        title: title ?? prev.title,
        summary: summary ?? prev.summary,
      }))
    } catch {
      setFormError("Could not enrich this URL right now. You can still add it manually.")
    } finally {
      setIsEnriching(false)
    }
  }

  const handleDelete = async (link: VaultLink) => {
    setMenuOpenId(null)
    if (!window.confirm(`Delete "${link.title}"?`)) return
    const previous = links
    setLinks((prev) => prev.filter((item) => item.id !== link.id))
    if (selectedLink?.id === link.id) setSelectedLink(null)
    const { error } = await supabase.from("vault_links").delete().eq("id", link.id)
    if (error) {
      setLinks(previous)
      setFormError(error.message)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    const category =
      categoryMode === "new"
        ? normalizeCategory(newCategoryName)
        : normalizeCategory(formState.category)
    if (!formState.title.trim() || !formState.url.trim() || !formState.sourceUrl.trim() || !category) {
      setFormError("Title, URL, Source URL, and Category are required.")
      return
    }
    try {
      new URL(formState.url)
      new URL(formState.sourceUrl)
    } catch {
      setFormError("URL and Source URL must be valid links.")
      return
    }

    setIsSubmitting(true)
    if (formMode === "create") {
      const { data, error } = await supabase
        .from("vault_links")
        .insert({
          title: formState.title.trim(),
          url: formState.url.trim(),
          source_url: formState.sourceUrl.trim(),
          category,
          status: "Backlog",
          summary: formState.summary.trim() || null,
        })
        .select("id, title, url, source_url, category, status, summary, created_at")
        .single()
      setIsSubmitting(false)
      if (error) return setFormError(error.message)
      setLinks((prev) => sortLinksLatest([data as VaultLink, ...prev]))
      setFormOpen(false)
      resetForm(category)
      return
    }

    if (!editingId) {
      setIsSubmitting(false)
      return setFormError("No link selected for edit.")
    }
    const { data, error } = await supabase
      .from("vault_links")
      .update({
        title: formState.title.trim(),
        url: formState.url.trim(),
        source_url: formState.sourceUrl.trim(),
        category,
        summary: formState.summary.trim() || null,
      })
      .eq("id", editingId)
      .select("id, title, url, source_url, category, status, summary, created_at")
      .single()
    setIsSubmitting(false)
    if (error) return setFormError(error.message)
    setLinks((prev) =>
      sortLinksLatest(prev.map((item) => (item.id === editingId ? (data as VaultLink) : item)))
    )
    if (selectedLink?.id === editingId) setSelectedLink(data as VaultLink)
    setFormOpen(false)
    setMenuOpenId(null)
    resetForm(category)
  }

  const handleLogout = async () => {
    setIsSigningOut(true)
    await new Promise((resolve) => setTimeout(resolve, 180))
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full overflow-hidden">
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
              {!collapsed && <p className="font-[family-name:var(--font-geist)] text-sm font-medium">Link Vault</p>}
            </div>
            <Button size="icon-sm" variant="ghost" onClick={() => setCollapsed((prev) => !prev)}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3">
            {!collapsed && <p className="px-2 text-xs text-muted-foreground uppercase">Categories</p>}
            {categories.map((category) => {
              const active = category === activeCategory
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-sm",
                    active ? "border-border bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/70",
                    collapsed && "justify-center px-1"
                  )}
                >
                  <Folders className="size-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{category}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{countsByCategory[category]}</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div className="border-t border-sidebar-border p-3">
            <div className={cn("rounded-xl border border-border/80 bg-card/70 p-2.5", collapsed && "text-center")}>
              <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
                {userAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userAvatarUrl} alt="" className="size-8 rounded-full border border-border/80 object-cover" />
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

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <Button
                size="icon-sm"
                variant="outline"
                className="md:hidden"
                aria-label={mobileCategoriesOpen ? "Close categories" : "Open categories"}
                onClick={() => setMobileCategoriesOpen((prev) => !prev)}
              >
                {mobileCategoriesOpen ? <X /> : <Menu />}
              </Button>
              <div className="relative w-full max-w-2xl">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9 pr-16" placeholder="Search links, source URLs, or summaries..." />
                <div className="pointer-events-none absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-border/80 bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground">
                  <Command className="size-3" />
                  <span>K</span>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={openCreate}>
                <Plus />
                Add Link
              </Button>
            </div>

            <AnimatePresence>
              {mobileCategoriesOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 flex flex-wrap gap-2 md:hidden">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={category === activeCategory ? "secondary" : "ghost"}
                      className="rounded-full"
                      onClick={() => {
                        setActiveCategory(category)
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-geist)] text-2xl font-semibold">Link Vault</h1>
                <p className="mt-1 text-sm text-muted-foreground">High-signal links sorted by newest first with source provenance.</p>
              </div>
              <Badge variant="outline">{filteredLinks.length} links</Badge>
            </div>

            {isInitialLoading ? (
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <LinkCardSkeleton key={`skeleton-${index}`} />
                ))}
              </section>
            ) : (
              <motion.section
                key={`${activeCategory}:${query}:${filteredLinks.length}`}
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredLinks.map((link) => {
                  return (
                    <motion.article key={link.id} variants={itemVariants}>
                      <LinkCard
                        link={link}
                        isMenuOpen={menuOpenId === link.id}
                        onOpenDetails={() => setSelectedLink(link)}
                        onToggleMenu={() => setMenuOpenId((prev) => (prev === link.id ? null : link.id))}
                        onEdit={() => openEdit(link)}
                        onDelete={() => handleDelete(link)}
                      />
                    </motion.article>
                  )
                })}
              </motion.section>
            )}

            {!isInitialLoading && !filteredLinks.length && (
              <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">No links match this filter. Add one with the button above.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <LinkDetailsModal link={selectedLink} onClose={() => setSelectedLink(null)} />

      <AnimatePresence>
        {formOpen && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.99 }} className="w-full max-w-xl">
              <Card className="border-border/80 bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{formMode === "create" ? "Add Link To Vault" : "Edit Link"}</CardTitle>
                      <CardDescription>Save URL, source URL, dynamic category, and summary.</CardDescription>
                    </div>
                    <Button size="icon-sm" variant="ghost" onClick={() => { setFormOpen(false); resetForm() }}>
                      <X />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL</label>
                      <div className="flex gap-2">
                        <Input value={formState.url} onChange={(e) => setFormState((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://example.com/article" required />
                        <Button type="button" variant="outline" onClick={handleAutoEnrich} disabled={isEnriching}>
                          {isEnriching ? "Enriching..." : "Auto Enrich"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input value={formState.title} onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))} placeholder="Readable title" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Source URL</label>
                      <Input value={formState.sourceUrl} onChange={(e) => setFormState((prev) => ({ ...prev, sourceUrl: e.target.value }))} placeholder="https://instagram.com/..." required />
                    </div>

                    <CategoryPicker
                      existingCategories={existingCategories}
                      categoryMode={categoryMode}
                      selectedCategory={formState.category}
                      newCategoryName={newCategoryName}
                      onCategoryModeChange={setCategoryMode}
                      onSelectedCategoryChange={(category) =>
                        setFormState((prev) => ({ ...prev, category }))
                      }
                      onNewCategoryNameChange={setNewCategoryName}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Summary (Optional)</label>
                      <textarea value={formState.summary} onChange={(e) => setFormState((prev) => ({ ...prev, summary: e.target.value }))} rows={4} className="w-full rounded-lg border border-input/80 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40" placeholder="Auto-Enrich can populate this from the URL." />
                    </div>

                    {formError && <p className="text-sm text-destructive">{formError}</p>}

                    <div className="flex items-center justify-end gap-2">
                      <Button type="button" variant="ghost" onClick={() => { setFormOpen(false); resetForm() }}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : formMode === "create" ? "Save Link" : "Update Link"}</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
