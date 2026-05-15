import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  PersonalityQuestionFields,
  type PersonalityQuestionForm,
  PersonalityVersionFields,
  type PersonalityVersionForm,
} from "@/components/admin/personality/personality-forms"
import type { PersonalityVersion } from "@/types/admin"

type PersonalityDialogsProps = {
  creating: boolean
  editing: PersonalityVersion | null
  duplicating: PersonalityVersion | null
  questionTarget: PersonalityVersion | null
  mutatingId: string
  versionForm: PersonalityVersionForm
  questionForm: PersonalityQuestionForm
  setCreating: (open: boolean) => void
  setEditing: (version: PersonalityVersion | null) => void
  setDuplicating: (version: PersonalityVersion | null) => void
  setQuestionTarget: (version: PersonalityVersion | null) => void
  setVersionForm: (form: PersonalityVersionForm) => void
  setQuestionForm: (form: PersonalityQuestionForm) => void
  onCreateVersion: () => void
  onUpdateVersion: () => void
  onDuplicateVersion: () => void
  onAddQuestion: () => void
}

export function PersonalityDialogs({
  creating,
  editing,
  duplicating,
  questionTarget,
  mutatingId,
  versionForm,
  questionForm,
  setCreating,
  setEditing,
  setDuplicating,
  setQuestionTarget,
  setVersionForm,
  setQuestionForm,
  onCreateVersion,
  onUpdateVersion,
  onDuplicateVersion,
  onAddQuestion,
}: PersonalityDialogsProps) {
  return (
    <>
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle version de test</DialogTitle>
          </DialogHeader>
          <PersonalityVersionFields
            form={versionForm}
            setForm={setVersionForm}
            showVersion
          />
          <PersonalityQuestionFields
            form={questionForm}
            setForm={setQuestionForm}
          />
          <Button disabled={mutatingId === "create"} onClick={onCreateVersion}>
            Créer
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la version</DialogTitle>
          </DialogHeader>
          <PersonalityVersionFields form={versionForm} setForm={setVersionForm} />
          <Button disabled={mutatingId === editing?._id} onClick={onUpdateVersion}>
            Enregistrer
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!duplicating}
        onOpenChange={(open) => !open && setDuplicating(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer la version</DialogTitle>
          </DialogHeader>
          <PersonalityVersionFields
            form={versionForm}
            setForm={setVersionForm}
            showVersion
          />
          <Button
            disabled={mutatingId === duplicating?._id}
            onClick={onDuplicateVersion}
          >
            Dupliquer
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!questionTarget}
        onOpenChange={(open) => !open && setQuestionTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une question</DialogTitle>
          </DialogHeader>
          <PersonalityQuestionFields
            form={questionForm}
            setForm={setQuestionForm}
          />
          <Button
            disabled={mutatingId === questionTarget?._id}
            onClick={onAddQuestion}
          >
            Ajouter
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
