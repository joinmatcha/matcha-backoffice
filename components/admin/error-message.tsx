export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
      {message}
    </div>
  )
}
