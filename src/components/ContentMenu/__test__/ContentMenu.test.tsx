import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ContentMenu } from "../ContentMenu"

describe("ContentMenu Component", () => {
  it("should render and display the menu", () => {
    render(<ContentMenu />)

    const accordion = screen.getByRole("accordion")

    expect(accordion).toBeInTheDocument()
    expect(accordion.firstChild).toHaveAttribute("data-state", "closed")
  })

  it("should toggle the menu open/closed", () => {
    render(<ContentMenu />)

    const accordion = screen.getByRole("accordion")

    fireEvent.click(accordion)
    setTimeout(() => {
      expect(accordion.firstChild).toHaveAttribute("data-state", "open")
    }, 200)

    fireEvent.click(accordion)
    expect(accordion.firstChild).toHaveAttribute("data-state", "closed")
  })
})
