import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";

export function VaultCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-card rounded-2xl shadow-sm">
      {/* Top Banner Skeleton - Matches h-60 VaultCard cover */}
      <div className="h-60 w-full bg-muted/40 border-b border-border/80 relative p-3 flex flex-col justify-between shrink-0">
        <Skeleton className="h-4 w-24 bg-muted/80 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-lg bg-muted/80" />
          <Skeleton className="h-3 w-28 bg-muted/80 rounded-md" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <CardContent className="flex flex-1 flex-col p-4 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4 bg-muted/80 rounded-md" />
          <Skeleton className="size-5 rounded-lg bg-muted/80 shrink-0" />
        </div>

        <Skeleton className="h-4.5 w-16 bg-muted/80 rounded-md" />

        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full bg-muted/80 rounded-md" />
          <Skeleton className="h-3 w-4/5 bg-muted/80 rounded-md" />
          <Skeleton className="h-3 w-3/5 bg-muted/80 rounded-md" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-3 border-t border-border/80 flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-24 bg-muted/80 rounded-md" />
          <div className="flex items-center gap-1">
            <Skeleton className="size-6 bg-muted/80 rounded-lg" />
            <Skeleton className="size-6 bg-muted/80 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
