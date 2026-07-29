import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  BilanQuestionFields,
  BilanVersionFields,
  emptyBilanQuestionForm,
  emptyBilanVersionForm,
} from "@/components/admin/bilan/bilan-forms"

describe("BilanVersionFields", () => {
  it("updates version form fields", async () => {
    const user = userEvent.setup()
    const setForm = vi.fn()
    const form = { ...emptyBilanVersionForm, version: "1" }

    render(<BilanVersionFields form={form} setForm={setForm} />)

    await user.type(screen.getByPlaceholderText("Titre"), "Bilan v1")

    expect(setForm).toHaveBeenCalledWith({
      ...form,
      title: "B",
    })
  })

  it("locks the version input while editing", () => {
    render(
      <BilanVersionFields
        form={{ ...emptyBilanVersionForm, version: "2" }}
        setForm={vi.fn()}
        lockVersion
      />
    )

    expect(screen.getByPlaceholderText("Version")).toBeDisabled()
  })
})

describe("BilanQuestionFields", () => {
  it("updates question form fields", async () => {
    const user = userEvent.setup()
    const setForm = vi.fn()
    const form = { ...emptyBilanQuestionForm, code: "EXP_1", version: "1" }

    render(<BilanQuestionFields form={form} setForm={setForm} />)

    await user.selectOptions(screen.getByDisplayValue("Compétence"), "soft_skill")
    await user.click(screen.getByLabelText("Question active"))

    expect(setForm).toHaveBeenCalledWith({
      ...form,
      domain: "soft_skill",
    })
    expect(setForm).toHaveBeenCalledWith({
      ...form,
      isActive: false,
    })
  })
})
