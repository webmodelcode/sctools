import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { QuickMessageOptions } from "../QuickMessageOptions";

describe("QuickMessageOptions.tsx", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render component", () => {
    render(<QuickMessageOptions label="label" text="text" />);
    const div = screen.getByText("label");
    expect(div).toBeInTheDocument();
  });
});
