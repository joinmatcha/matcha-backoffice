import type { PersonalityQuestionForm } from "@/components/admin/personality/personality-forms"
import type { PersonalityQuestion } from "@/types/admin"

export function toPersonalityQuestionPayload(
  form: PersonalityQuestionForm
): PersonalityQuestion {
  return {
    id: form.id,
    text: form.text,
    dimension: form.dimension,
    options: [
      { value: -2, label: form.minusLabel },
      { value: -1, label: "Plutôt non" },
      { value: 0, label: "Neutre" },
      { value: 1, label: "Plutôt oui" },
      { value: 2, label: form.plusLabel },
    ],
  }
}
