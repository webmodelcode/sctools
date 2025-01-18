import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Popup } from "../Popup"

describe("Popup Component", () => {
  beforeEach(() => {
    // Mock chrome API
    global.chrome = {
      tabs: {
        create: vi.fn()
      }
    } as any
  })

  it("should render title correctly", () => {
    render(<Popup />)
    expect(screen.getByText("ScTools")).toBeInTheDocument()
  })

  it("should handle donation button click", () => {
    render(<Popup />)
    const donationButton = screen.getByText(/buy me a coffee/i)
    fireEvent.click(donationButton)

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: "https://buymeacoffee.com/juanleon"
    })
  })

  it("should toggle extension state", () => {
    render(<Popup />)
    const toggle = screen.getByRole("switch")
    fireEvent.click(toggle)

    expect(toggle).toBeChecked()
  })
})
