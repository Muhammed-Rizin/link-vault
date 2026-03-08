import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        secondary: "border-input bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success:
          "border-emerald-400/30 bg-emerald-500/12 text-emerald-300 dark:border-emerald-400/30 dark:bg-emerald-500/12 dark:text-emerald-300",
        warning:
          "border-amber-400/30 bg-amber-500/12 text-amber-300 dark:border-amber-400/30 dark:bg-amber-500/12 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      data-slot="badge"
      {...props}
    />
  )
}

export { Badge, badgeVariants }

