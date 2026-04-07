import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { QuickMessagesMenu } from "../QuickMessagesMenu";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";

import { isEditableElement } from "~@/config/utils/isTextElement";

// Mock the isEditableElement function
vi.mock("~@/config/utils/isTextElement", async (importOriginal) => {
  await importOriginal();
  return {
    isEditableElement: vi.fn(),
  };
});

vi.mock("~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus", () => ({
  useFeaturesStatus: vi.fn(),
}));

describe("QuickMessagesMenu.tsx", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock the useFeaturesStatus hook
    vi.mocked(useFeaturesStatus).mockReturnValue({
      quickMessages: { isEnabled: true, toggle: vi.fn() },
      translator: { isEnabled: true, toggle: vi.fn() },
      quickMenu: { isEnabled: true, toggle: vi.fn() },
      speechToTranslate: { isEnabled: false, toggle: vi.fn() },
      isInitialized: true,
    });

    // Mock the isEditableElement function
    vi.mocked(isEditableElement).mockReturnValue(true);
  });

  it("should no render when isOpen is false", async () => {
    await act(async () => {
      render(<QuickMessagesMenu />);
    });
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should no render when ext is disabled", async () => {
    vi.mocked(isEditableElement).mockReturnValue(true);

    await act(async () => {
      render(<QuickMessagesMenu />);
    });
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should render component", async () => {
    render(<QuickMessagesMenu />);
    act(() => {
      fireEvent(document, new Event("selectionchange"));
    });

    const menu = await screen.findByRole("QuickMessagesMenu");

    expect(menu).toBeInTheDocument();
    expect(menu.childElementCount).toBeGreaterThan(0);
  });

  it("should close when a non-editable element is focused", async () => {
    render(<QuickMessagesMenu />);
    act(() => {
      fireEvent(document, new Event("selectionchange"));
    });

    const menu = await screen.findByRole("QuickMessagesMenu");

    expect(menu).toBeInTheDocument();

    act(() => {
      vi.mocked(isEditableElement).mockReturnValue(false);
      fireEvent(document, new Event("selectionchange"));
    });
    expect(menu).not.toBeInTheDocument();
  });
});
