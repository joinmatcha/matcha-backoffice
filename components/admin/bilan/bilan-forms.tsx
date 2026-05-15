import { Input } from "@/components/ui/input"
import { AdminTextarea, selectClassName } from "@/components/admin/form-controls"
import { bilanDomainLabels } from "@/components/admin/bilan/bilan-constants"
import type { BilanQuestionDomain, BilanQuestionType } from "@/types/admin"

export type BilanVersionForm = {
  version: string
  title: string
  description: string
}

export type BilanQuestionForm = {
  code: string
  domain: BilanQuestionDomain
  subdomain: string
  question: string
  type: BilanQuestionType
  version: string
  isActive: boolean
}

export const emptyBilanVersionForm: BilanVersionForm = {
  version: "",
  title: "",
  description: "",
}

export const emptyBilanQuestionForm: BilanQuestionForm = {
  code: "",
  domain: "experience",
  subdomain: "",
  question: "",
  type: "likert_1_5",
  version: "",
  isActive: true,
}

export function BilanVersionFields({
  form,
  setForm,
  lockVersion,
}: {
  form: BilanVersionForm
  setForm: (form: BilanVersionForm) => void
  lockVersion?: boolean
}) {
  return (
    <div className="space-y-3">
      <Input
        value={form.version}
        type="number"
        disabled={lockVersion}
        onChange={(event) => setForm({ ...form, version: event.target.value })}
        placeholder="Version"
      />
      <Input
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        placeholder="Titre"
      />
      <AdminTextarea
        value={form.description}
        onChange={(event) =>
          setForm({ ...form, description: event.target.value })
        }
        placeholder="Description"
      />
    </div>
  )
}

export function BilanQuestionFields({
  form,
  setForm,
}: {
  form: BilanQuestionForm
  setForm: (form: BilanQuestionForm) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={form.code}
          onChange={(event) => setForm({ ...form, code: event.target.value })}
          placeholder="Code"
        />
        <Input
          value={form.version}
          type="number"
          onChange={(event) => setForm({ ...form, version: event.target.value })}
          placeholder="Version"
        />
      </div>
      <AdminTextarea
        value={form.question}
        onChange={(event) =>
          setForm({ ...form, question: event.target.value })
        }
        placeholder="Question"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={form.domain}
          onChange={(event) =>
            setForm({
              ...form,
              domain: event.target.value as BilanQuestionDomain,
            })
          }
          className={selectClassName}
        >
          {Object.entries(bilanDomainLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={form.type}
          onChange={(event) =>
            setForm({ ...form, type: event.target.value as BilanQuestionType })
          }
          className={selectClassName}
        >
          <option value="likert_1_5">Likert 1-5</option>
          <option value="open_text">Texte libre</option>
        </select>
      </div>
      <Input
        value={form.subdomain}
        onChange={(event) =>
          setForm({ ...form, subdomain: event.target.value })
        }
        placeholder="Sous-domaine"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) =>
            setForm({ ...form, isActive: event.target.checked })
          }
        />
        Question active
      </label>
    </div>
  )
}
