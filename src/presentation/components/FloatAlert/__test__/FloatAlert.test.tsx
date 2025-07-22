import { describe, expect, it } from "vitest";
import { FloatAlert } from "../FloatAlert";
import { render, screen } from "@testing-library/react";

describe("FloatAlert.test.tsx", () => {
  it("should render component", () => {
    const msg = "message of alert";
    render(<FloatAlert message={msg} />);
    expect(screen.getByText(msg)).toBeInTheDocument();
  });

  it("should render component with title", () => {
    const title = "title of alert";
    const msg = "message of alert";
    render(<FloatAlert title={title} message={msg} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(msg)).toBeInTheDocument();
  });

  it("should render component without destructive variant", () => {
    const msg = "message of alert";
    render(<FloatAlert message={msg} />);
    expect(screen.getByText(msg)).toBeInTheDocument();
    expect(
      screen.getByRole("alert").classList.toString().includes("destructive")
    ).toBeFalsy();
  });

  it("should render component with destructive variant", () => {
    const msg = "message of alert";
    render(<FloatAlert destructive={true} message={msg} />);
    expect(screen.getByText(msg)).toBeInTheDocument();
    expect(
      screen.getByRole("alert").classList.toString().includes("destructive")
    ).toBeTruthy();
  });
});
