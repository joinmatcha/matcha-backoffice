import { Copy } from "lucide-react"
import { bilanDomainLabels } from "@/components/admin/bilan/bilan-constants"
import { EmptyState } from "@/components/admin/empty-state"
import { PaginationControls } from "@/components/admin/pagination-controls"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import type { BilanQuestion, BilanVersion, Pagination } from "@/types/admin"

type BilanVersionsSectionProps = {
  versions: BilanVersion[]
  loading: boolean
  pagination?: Pagination
  mutatingVersion: number | null
  onPageChange: (page: number) => void
  onEdit: (version: BilanVersion) => void
  onDuplicate: (version: BilanVersion) => void
  onToggle: (version: BilanVersion) => void
}

export function BilanVersionsSection({
  versions,
  loading,
  pagination,
  mutatingVersion,
  onPageChange,
  onEdit,
  onDuplicate,
  onToggle,
}: BilanVersionsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Versions</h2>
      <div className="grid gap-3">
        {versions.map((version) => (
          <BilanVersionCard
            key={version._id}
            version={version}
            mutatingVersion={mutatingVersion}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggle={onToggle}
          />
        ))}
      </div>
      {!loading && versions.length === 0 && (
        <EmptyState label="Aucune version de bilan trouvée." />
      )}
      <PaginationControls pagination={pagination} onPageChange={onPageChange} />
    </section>
  )
}

type BilanVersionCardProps = {
  version: BilanVersion
  mutatingVersion: number | null
  onEdit: (version: BilanVersion) => void
  onDuplicate: (version: BilanVersion) => void
  onToggle: (version: BilanVersion) => void
}

function BilanVersionCard({
  version,
  mutatingVersion,
  onEdit,
  onDuplicate,
  onToggle,
}: BilanVersionCardProps) {
  return (
    <div className="matcha-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">
              Version {version.version} · {version.title}
            </h3>
            <StatusBadge active={version.isActive} label={version.status} />
          </div>
          {version.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {version.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(version)}>
            Modifier
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDuplicate(version)}
          >
            <Copy />
            Dupliquer
          </Button>
          <Button
            size="sm"
            variant={version.isActive ? "secondary" : "default"}
            disabled={mutatingVersion === version.version}
            onClick={() => onToggle(version)}
          >
            {version.isActive ? "Désactiver" : "Activer"}
          </Button>
        </div>
      </div>
    </div>
  )
}

type BilanQuestionsSectionProps = {
  questions: BilanQuestion[]
  loading: boolean
  pagination?: Pagination
  onPageChange: (page: number) => void
  onEdit: (question: BilanQuestion) => void
}

export function BilanQuestionsSection({
  questions,
  loading,
  pagination,
  onPageChange,
  onEdit,
}: BilanQuestionsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Questions</h2>
      <div className="matcha-table">
        <table className="w-full text-sm">
          <thead className="bg-accent/60 text-left text-accent-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Domaine</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question._id} className="border-t border-border/70">
                <td className="px-4 py-3 font-medium">{question.code}</td>
                <td className="px-4 py-3">{question.question}</td>
                <td className="px-4 py-3">{bilanDomainLabels[question.domain]}</td>
                <td className="px-4 py-3">{question.version}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={question.isActive} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(question)}
                  >
                    Modifier
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && questions.length === 0 && (
          <div className="p-4">
            <EmptyState label="Aucune question de bilan trouvée." />
          </div>
        )}
      </div>
      {loading && (
        <div className="text-sm text-muted-foreground">Chargement...</div>
      )}
      <PaginationControls pagination={pagination} onPageChange={onPageChange} />
    </section>
  )
}
