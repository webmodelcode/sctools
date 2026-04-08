import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PopupContent } from "../PopupContent";
import { QUICK_MESSAGE_OPERATIONS } from "../../QuickMessageOperations/strings.json";

// Mock useFeaturesStatus
vi.mock("~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus", () => ({
  useFeaturesStatus: () => ({
    translator: { isEnabled: true, toggle: vi.fn() },
    quickMessages: { isEnabled: true, toggle: vi.fn() },
    quickMenu: { isEnabled: true, toggle: vi.fn() },
    speechToTranslate: { isEnabled: false, toggle: vi.fn() },
    isInitialized: true,
  }),
}));

// Mock child components to isolate PopupContent structure testing
vi.mock("../../../QuickMessages/QuickMessagesList/QuickMessagesList", () => ({
  QuickMessagesList: () => (
    <div data-testid="quick-messages-list">QuickMessagesList</div>
  ),
}));

vi.mock("../../QuickMessageOperations/QuickMessageOperations", () => ({
  QuickMessageOperations: () => (
    <div data-testid="quick-message-operations">
      {QUICK_MESSAGE_OPERATIONS.TITLE}
    </div>
  ),
}));

vi.mock("../../ExtensionToggle/ExtensionToggle", () => ({
  ExtensionToggle: () => (
    <div data-testid="extension-toggle">ExtensionToggle</div>
  ),
}));

vi.mock("~@/presentation/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TabsTrigger: ({ children }: { children: React.ReactNode }) => (
    <button role="tab">{children}</button>
  ),
  TabsContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("PopupContent Component", () => {
  it("should render Tabs with correct triggers", () => {
    render(<PopupContent />);

    // Verify Tabs Triggers
    expect(
      screen.getByRole("tab", { name: "Mensajes Rápidos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Funcionalidades" }),
    ).toBeInTheDocument();
  });

  it("should render QuickMessageOperations content by default", () => {
    render(<PopupContent />);

    // QuickMessages tab is default
    expect(screen.getByTestId("quick-message-operations")).toBeInTheDocument();
    expect(screen.getByTestId("quick-messages-list")).toBeInTheDocument();
  });

  it("should have correct layout structure for QuickMessages tab", () => {
    render(<PopupContent />);

    const quickMessagesContent = screen.getByTestId(
      "quick-message-operations",
    ).parentElement;
    expect(quickMessagesContent).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-2",
      "p-3",
    );
  });
});
