import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuickMessagesOptionsArea } from "../QuickMessagesOptionsArea";

describe("QuickMessagesOptiosArea.test.tsx", () => {
  it("should render the component", () => {
    render(<QuickMessagesOptionsArea />);
    expect(screen.getByRole("scroll")).toBeInTheDocument();
  });
});
