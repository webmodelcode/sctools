import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { QuickMessage } from "../QuickMessage";

describe("QuickMessage.tsx", () => {
  it("should render component", () => {
    render(<QuickMessage />);
    const div = screen.getByText("QuickMessage");
    expect(div).toBeInTheDocument();
  });
});
