import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { PaginationControls } from "@/components/admin/pagination-controls"

describe("PaginationControls", () => {
  it("does not render when there is only one page", () => {
    const { container } = render(
      <PaginationControls
        pagination={{ page: 1, limit: 20, total: 1, totalPages: 1 }}
        onPageChange={vi.fn()}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("moves to the previous and next page", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        pagination={{ page: 2, limit: 20, total: 60, totalPages: 3 }}
        onPageChange={onPageChange}
      />
    )

    expect(screen.getByText("Page 2 / 3")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Précédent" }))
    await user.click(screen.getByRole("button", { name: "Suivant" }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })

  it("disables boundary actions", () => {
    render(
      <PaginationControls
        pagination={{ page: 1, limit: 20, total: 60, totalPages: 3 }}
        onPageChange={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: "Précédent" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Suivant" })).toBeEnabled()
  })
})
