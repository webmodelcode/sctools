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
  });

  it("should no render when isOpen is false", async () => {
    // Create a mock implementation of getItem
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useQuickMenuIsActive hook to return the mock getItem function
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
    });

    await act(async () => {
      render(<QuickMessagesMenu />);
    });
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should no render when ext is disabled", async () => {
    vi.mocked(isEditableElement).mockReturnValue(true);
    // Create a mock implementation of getItem
    const mockGetItem = vi.fn().mockResolvedValue("false");

    // Mock the useQuickMenuIsActive hook to return the mock getItem function
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
    });

    await act(async () => {
      render(<QuickMessagesMenu />);
    });
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should render component", async () => {
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useQuickMenuIsActive hook to return the mock getItem function
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
    });
    vi.mocked(isEditableElement).mockReturnValue(true);
    render(<QuickMessagesMenu />);
    act(() => {
      fireEvent(document, new Event("selectionchange"));
    });

    const menu = await screen.findByRole("QuickMessagesMenu");

    expect(menu).toBeInTheDocument();
    expect(menu.childElementCount).toBeGreaterThan(0);
  });

  it("should close when a non-editable element is focused", async () => {
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useQuickMenuIsActive hook to return the mock getItem function
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
    });
    vi.mocked(isEditableElement).mockReturnValue(true);
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
