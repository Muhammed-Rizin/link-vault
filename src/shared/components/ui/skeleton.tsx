import type { ComponentProps } from "react"

import { cn } from "@/shared/utils/utils"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-muted/70", className)} {...props} />
}

export { Skeleton }
