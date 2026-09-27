// Source: shadcn/ui — https://ui.shadcn.com/docs/components/skeleton
// License: MIT (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
// Adapted for this project: alias imports rewritten to @/lib/utils.
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }