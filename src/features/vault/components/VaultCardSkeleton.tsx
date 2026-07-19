import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";

export function VaultCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-[#262626] bg-[#141414] rounded-lg">
      {/* Top Banner Skeleton - Matches h-40 VaultCard cover */}
      <div className="h-60 w-full bg-[#1a1a1a] border-b border-[#262626] relative p-3 flex flex-col justify-between shrink-0">
        <Skeleton className="h-4 w-24 bg-[#262626] rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded bg-[#262626]" />
          <Skeleton className="h-3 w-28 bg-[#262626] rounded" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <CardContent className="flex flex-1 flex-col p-4 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4 bg-[#262626] rounded" />
          <Skeleton className="size-5 rounded bg-[#262626] shrink-0" />
        </div>

        <Skeleton className="h-4.5 w-16 bg-[#262626] rounded" />

        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full bg-[#262626] rounded" />
          <Skeleton className="h-3 w-4/5 bg-[#262626] rounded" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-24 bg-[#262626] rounded" />
          <div className="flex items-center gap-1">
            <Skeleton className="size-6 bg-[#262626] rounded" />
            <Skeleton className="size-6 bg-[#262626] rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
