import { Copy, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/status-badge"
import type { PersonalityVersion } from "@/types/admin"

type PersonalityVersionCardProps = {
  version: PersonalityVersion
  mutatingId: string
  onEdit: (version: PersonalityVersion) => void
  onDuplicate: (version: PersonalityVersion) => void
  onAddQuestion: (version: PersonalityVersion) => void
  onToggle: (version: PersonalityVersion) => void
  onDeleteQuestion: (version: PersonalityVersion, questionId: string) => void
}

export function PersonalityVersionCard({
  version,
  mutatingId,
  onEdit,
  onDuplicate,
  onAddQuestion,
  onToggle,
  onDeleteQuestion,
}: PersonalityVersionCardProps) {
  return (
    <div className="matcha-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{version.title}</h2>
            <StatusBadge active={version.isActive} label={version.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Version {version.version} · {version.questions.length} questions ·{" "}
            {version.profiles.length} profils
          </p>
          {version.summary && <p className="mt-2 text-sm">{version.summary}</p>}
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
            variant="outline"
            onClick={() => onAddQuestion(version)}
          >
            <Plus />
            Question
          </Button>
          <Button
            size="sm"
            variant={version.isActive ? "secondary" : "default"}
            disabled={mutatingId === version._id}
            onClick={() => onToggle(version)}
          >
            {version.isActive ? "Désactiver" : "Activer"}
          </Button>
        </div>
      </div>

      {version.questions.length > 0 && (
        <div className="mt-4 rounded-2xl bg-accent/40 p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Questions
          </p>
          <div className="grid gap-2">
            {version.questions.slice(0, 4).map((question) => (
              <div
                key={question.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-white/65 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{question.text}</p>
                  <p className="text-muted-foreground">
                    {question.id} · {question.dimension}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDeleteQuestion(version, question.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
