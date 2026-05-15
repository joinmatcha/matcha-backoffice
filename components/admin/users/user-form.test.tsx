import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { toUserFormState, UserForm } from "@/components/admin/users/user-form"
import type { AdminUser } from "@/types/admin"

const baseUser: AdminUser = {
  _id: "u1",
  email: "admin@matcha.local",
  firstName: "Ada",
  lastName: "Lovelace",
  subscription: "premium",
  role: "admin",
  isEmailVerified: true,
  consentAccepted: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("toUserFormState", () => {
  it("maps an admin user to the editable form state", () => {
    expect(toUserFormState(baseUser)).toEqual({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "admin@matcha.local",
      role: "admin",
      subscription: "premium",
      isEmailVerified: true,
    })
  })
})

describe("UserForm", () => {
  it("emits form changes and submit action", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onSubmit = vi.fn()
    const form = toUserFormState(baseUser)

    render(
      <UserForm
        form={form}
        saving={false}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    )

    await user.selectOptions(screen.getByDisplayValue("Admin"), "user")
    await user.click(screen.getByLabelText("Email vérifié"))
    await user.click(screen.getByRole("button", { name: "Enregistrer" }))

    expect(onChange).toHaveBeenCalledWith({ ...form, role: "user" })
    expect(onChange).toHaveBeenCalledWith({ ...form, isEmailVerified: false })
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
