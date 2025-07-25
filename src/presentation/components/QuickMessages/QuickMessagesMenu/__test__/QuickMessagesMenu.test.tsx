import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { QuickMessagesMenu } from "../QuickMessagesMenu";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

import { isEditableElement } from "~@/config/utils/isTextElement";

// Mock the isEditableElement function
vi.mock("~@/config/utils/isTextElement", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    isEditableElement: vi.fn(),
    // your mocked methods
  };
});

vi.mock(
  "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive",
  () => ({
    useQuickMenuIsActive: vi.fn(),
  }),
);

// Define the interface for the mock to match the actual implementation
interface MockUseQuickMenuIsActive {
  getItem: () => Promise<boolean | string>;
  setItem: (value: boolean) => Promise<void>;
}

describe("QuickMessagesMenu.tsx", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock the useQuickMenuIsActive hook
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: vi.fn().mockResolvedValue(true),
      setItem: vi.fn(),
      watchItem: vi.fn().mockResolvedValue(true),
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
