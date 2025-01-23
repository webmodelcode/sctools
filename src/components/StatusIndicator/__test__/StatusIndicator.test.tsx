import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { StatusIndicator } from "../StatusIndicator";

describe("StatusIndicator", () => {
  it("renders a success status indicator", async () => {
    render(<StatusIndicator />);

    const statusIndicator = await screen.findByRole("statusIndicator");
    expect(statusIndicator).toBeInTheDocument();
    expect(statusIndicator).toHaveClass("sct-status-indicator");
    expect(statusIndicator.firstChild).toHaveClass("sct-indicator-dot");
    expect(statusIndicator.childElementCount).toBe(2);
  });
});
