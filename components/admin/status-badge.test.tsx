import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StatusBadge } from "@/components/admin/status-badge"

describe("StatusBadge", () => {
  it("renders the default active label", () => {
    render(<StatusBadge active />)

    expect(screen.getByText("Actif")).toBeInTheDocument()
  })

  it("renders the default inactive label", () => {
    render(<StatusBadge active={false} />)

    expect(screen.getByText("Inactif")).toBeInTheDocument()
  })

  it("allows an explicit label", () => {
    render(<StatusBadge active label="running" />)

    expect(screen.getByText("running")).toBeInTheDocument()
  })
})
