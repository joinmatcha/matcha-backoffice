import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  BilanQuestionFields,
  type BilanQuestionForm,
  BilanVersionFields,
  type BilanVersionForm,
} from "@/components/admin/bilan/bilan-forms"

type BilanDialogsProps = {
  versionDialog: "create" | "edit" | "duplicate" | null
  questionDialog: "create" | "edit" | null
  versionForm: BilanVersionForm
  questionForm: BilanQuestionForm
  setVersionDialog: (dialog: "create" | "edit" | "duplicate" | null) => void
  setQuestionDialog: (dialog: "create" | "edit" | null) => void
  setVersionForm: (form: BilanVersionForm) => void
  setQuestionForm: (form: BilanQuestionForm) => void
  onSaveVersion: () => void
  onSaveQuestion: () => void
}

export function BilanDialogs({
  versionDialog,
  questionDialog,
  versionForm,
  questionForm,
  setVersionDialog,
  setQuestionDialog,
  setVersionForm,
  setQuestionForm,
  onSaveVersion,
  onSaveQuestion,
}: BilanDialogsProps) {
  return (
    <>
      <Dialog
        open={!!versionDialog}
        onOpenChange={(open) => !open && setVersionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {versionDialog === "edit"
                ? "Modifier la version"
                : versionDialog === "duplicate"
                  ? "Dupliquer la version"
                  : "Nouvelle version"}
            </DialogTitle>
          </DialogHeader>
          <BilanVersionFields
            form={versionForm}
            setForm={setVersionForm}
            lockVersion={versionDialog === "edit"}
          />
          <Button onClick={onSaveVersion}>Enregistrer</Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!questionDialog}
        onOpenChange={(open) => !open && setQuestionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {questionDialog === "edit"
                ? "Modifier la question"
                : "Nouvelle question"}
            </DialogTitle>
          </DialogHeader>
          <BilanQuestionFields form={questionForm} setForm={setQuestionForm} />
          <Button onClick={onSaveQuestion}>Enregistrer</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
