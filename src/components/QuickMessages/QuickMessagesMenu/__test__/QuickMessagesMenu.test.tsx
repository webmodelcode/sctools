import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { QuickMessagesMenu } from "../QuickMessagesMenu";
import { useLocalStorage } from "@/hooks";

import { isEditableElement } from "@/config";

// Mock the isEditableElement function
vi.mock(import("@/config"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isEditableElement: vi.fn(),
    // your mocked methods
  };
});

vi.mock("@/hooks", () => ({
  useLocalStorage: vi.fn(),
}));

describe("QuickMessagesMenu.tsx", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should no render when isOpen is false", () => {
    // Create a mock implementation of getItem
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    render(<QuickMessagesMenu />);
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should no render when ext is disabled", () => {
    vi.mocked(isEditableElement).mockReturnValue(true);
    // Create a mock implementation of getItem
    const mockGetItem = vi.fn().mockResolvedValue("false");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    render(<QuickMessagesMenu />);
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should render component", async () => {
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
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

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
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
