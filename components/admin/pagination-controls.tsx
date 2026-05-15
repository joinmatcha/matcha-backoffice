import { Button } from "@/components/ui/button"
import type { Pagination } from "@/types/admin"

type PaginationControlsProps = {
  pagination?: Pagination
  onPageChange: (page: number) => void
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Précédent
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {pagination.page} / {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Suivant
      </Button>
    </div>
  )
}
