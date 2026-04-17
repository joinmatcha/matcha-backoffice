export type TestResult = {
  userId: number
  score: number
  level: string
  strengths: string[]
  weaknesses: string[]
}

export const resultsMock: TestResult[] = [
  {
    userId: 1,
    score: 78,
    level: "Intermédiaire",
    strengths: ["Communication", "Organisation"],
    weaknesses: ["Confiance", "Prise de décision"],
  },
]