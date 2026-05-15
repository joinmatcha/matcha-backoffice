import { describe, expect, it } from "vitest"
import { toPersonalityQuestionPayload } from "@/components/admin/personality/personality-mappers"

describe("toPersonalityQuestionPayload", () => {
  it("builds the API payload from the question form", () => {
    expect(
      toPersonalityQuestionPayload({
        id: "q1",
        text: "Je préfère travailler seul",
        dimension: "EI",
        minusLabel: "Jamais",
        plusLabel: "Toujours",
      })
    ).toEqual({
      id: "q1",
      text: "Je préfère travailler seul",
      dimension: "EI",
      options: [
        { value: -2, label: "Jamais" },
        { value: -1, label: "Plutôt non" },
        { value: 0, label: "Neutre" },
        { value: 1, label: "Plutôt oui" },
        { value: 2, label: "Toujours" },
      ],
    })
  })
})
