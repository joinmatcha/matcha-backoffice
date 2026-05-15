import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  active?: boolean
  label?: string
}

export function StatusBadge({ active, label }: StatusBadgeProps) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {label ?? (active ? "Actif" : "Inactif")}
    </Badge>
  )
}
