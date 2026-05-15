import { Input } from "@/components/ui/input"
import { AdminTextarea, selectClassName } from "@/components/admin/form-controls"
import type { PersonalityDimension } from "@/types/admin"

export type PersonalityVersionForm = {
  version: string
  title: string
  summary: string
}

export type PersonalityQuestionForm = {
  id: string
  text: string
  dimension: PersonalityDimension
  minusLabel: string
  plusLabel: string
}

export const emptyPersonalityQuestion: PersonalityQuestionForm = {
  id: "",
  text: "",
  dimension: "EI",
  minusLabel: "Pas du tout",
  plusLabel: "Tout à fait",
}

export const emptyPersonalityVersion: PersonalityVersionForm = {
  version: "",
  title: "",
  summary: "",
}

export function PersonalityVersionFields({
  form,
  setForm,
  showVersion = false,
}: {
  form: PersonalityVersionForm
  setForm: (form: PersonalityVersionForm) => void
  showVersion?: boolean
}) {
  return (
    <div className="space-y-3">
      {showVersion && (
        <Input
          value={form.version}
          onChange={(event) => setForm({ ...form, version: event.target.value })}
          placeholder="Version"
        />
      )}
      <Input
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        placeholder="Titre"
      />
      <AdminTextarea
        value={form.summary}
        onChange={(event) => setForm({ ...form, summary: event.target.value })}
        placeholder="Résumé"
      />
    </div>
  )
}

export function PersonalityQuestionFields({
  form,
  setForm,
}: {
  form: PersonalityQuestionForm
  setForm: (form: PersonalityQuestionForm) => void
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-accent/40 p-3">
      <Input
        value={form.id}
        onChange={(event) => setForm({ ...form, id: event.target.value })}
        placeholder="Code question, ex: EI_01"
      />
      <AdminTextarea
        value={form.text}
        onChange={(event) => setForm({ ...form, text: event.target.value })}
        placeholder="Texte de la question"
      />
      <select
        value={form.dimension}
        onChange={(event) =>
          setForm({
            ...form,
            dimension: event.target.value as PersonalityDimension,
          })
        }
        className={selectClassName}
      >
        <option value="EI">EI</option>
        <option value="SN">SN</option>
        <option value="TF">TF</option>
        <option value="JP">JP</option>
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={form.minusLabel}
          onChange={(event) =>
            setForm({ ...form, minusLabel: event.target.value })
          }
          placeholder="Label -2"
        />
        <Input
          value={form.plusLabel}
          onChange={(event) =>
            setForm({ ...form, plusLabel: event.target.value })
          }
          placeholder="Label +2"
        />
      </div>
    </div>
  )
}
