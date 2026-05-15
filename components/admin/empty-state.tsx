export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-accent/35 p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}
