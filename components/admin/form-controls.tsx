import { cn } from "@/lib/utils"

export const selectClassName =
  "h-10 rounded-xl border border-input bg-white/70 px-3 text-sm shadow-[0_4px_12px_rgba(13,21,32,0.04)] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35"

export function AdminTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-input bg-white/70 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35",
        className
      )}
      {...props}
    />
  )
}
