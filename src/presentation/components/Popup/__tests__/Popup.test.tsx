import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Popup } from "../Popup";

// Mock child components
vi.mock("../PopupContent/PopupContent", () => ({
  PopupContent: () => <div data-testid="popup-content">PopupContent</div>,
}));

vi.mock("../PopupHeader/PopupHeader", () => ({
  PopupHeader: () => <div data-testid="popup-header">PopupHeader</div>,
}));

vi.mock("../../LanguageSelector/LanguageSelector", () => ({
  LanguageSelector: () => (
    <div data-testid="language-selector">LanguageSelector</div>
  ),
}));

// Mock ui components
vi.mock("../../ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="popup-card" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("../../ui/label", () => ({
  Label: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
}));

describe("Popup Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render all main sections correctly", () => {
    render(<Popup />);

    expect(screen.getByTestId("popup-header")).toBeInTheDocument();
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
    expect(screen.getByTestId("popup-content")).toBeInTheDocument();
  });

  it("should render with correct layout classes", () => {
    render(<Popup />);

    const card = screen.getByTestId("popup-card");
    expect(card).toHaveClass(
      "flex min-h-130 min-w-md flex-col gap-2 rounded-none! bg-ew-star-color! text-white",
    );
  });
});
