import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import LoginForm from "@/components/auth/login-form"
import { adminApi } from "@/lib/api/admin"

const replace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
  }),
}))

vi.mock("@/lib/api/admin", () => ({
  adminApi: {
    login: vi.fn(),
  },
}))

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("submits credentials and redirects to the dashboard", async () => {
    const user = userEvent.setup()
    vi.mocked(adminApi.login).mockResolvedValue({
      user: { id: "1", email: "admin@matcha.local", role: "admin" },
    })

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText("Email"), "admin@matcha.local")
    await user.type(screen.getByPlaceholderText("Mot de passe"), "ChangeMe123!")
    await user.click(screen.getByRole("button", { name: "Connexion" }))

    expect(adminApi.login).toHaveBeenCalledWith(
      "admin@matcha.local",
      "ChangeMe123!"
    )
    expect(replace).toHaveBeenCalledWith("/dashboard")
  })

  it("shows API errors", async () => {
    const user = userEvent.setup()
    vi.mocked(adminApi.login).mockRejectedValue(new Error("Identifiants invalides"))

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText("Email"), "admin@matcha.local")
    await user.type(screen.getByPlaceholderText("Mot de passe"), "bad-password")
    await user.click(screen.getByRole("button", { name: "Connexion" }))

    expect(await screen.findByText("Identifiants invalides")).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })
})
