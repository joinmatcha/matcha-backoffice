import { Input } from "@/components/ui/input"

type ToolbarProps = {
  search: string
  placeholder: string
  onSearchChange: (value: string) => void
  children?: React.ReactNode
}

export function Toolbar({
  search,
  placeholder,
  onSearchChange,
  children,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        className="max-w-sm"
      />
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
