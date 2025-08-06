import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { QuickMessage } from "../QuickMessage";

describe("QuickMessage.tsx", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render component", () => {
    render(<QuickMessage label="add" text="text" />);
    const div = screen.getByText("add");
    expect(div).toBeInTheDocument();
  });

  it("should insert all labels", async () => {
    document.execCommand = vi.fn();

    const labels = ["add", "delete", "update"];

    render(
      labels.map((label) => (
        <QuickMessage key={label} label={label} text="text" />
      ))
    );
    const addLabel = await screen.findByText("add");
    const deleteLabel = await screen.findByText("delete");
    const updateLabel = await screen.findByText("update");

    fireEvent.click(addLabel);
    expect(document.execCommand).toBeCalledWith("insertText", false, "text");
    fireEvent.click(deleteLabel);
    expect(document.execCommand).toBeCalledWith("insertText", false, "text");
    fireEvent.click(updateLabel);
    expect(document.execCommand).toBeCalledWith("insertText", false, "text");

    expect(document.execCommand).toBeCalledTimes(labels.length);
  });
});
