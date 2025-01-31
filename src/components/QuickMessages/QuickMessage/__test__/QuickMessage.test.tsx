import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { QuickMessage } from "../QuickMessage";

describe("QuickMessage.tsx", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render component", () => {
    render(<QuickMessage label="label" text="text" />);
    const div = screen.getByText("label");
    expect(div).toBeInTheDocument();
  });

  it("should insert text", () => {
    document.execCommand = vi.fn();

    render(<QuickMessage label="label" text="text" />);
    const input = screen.getByText("label");
    fireEvent.click(input);

    expect(document.execCommand).toBeCalledWith("insertText", false, "text");
  });
});
