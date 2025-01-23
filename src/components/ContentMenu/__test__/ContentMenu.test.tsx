import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "@/hooks";
import { GLOBAL_STINGS } from "@/config";
import { ContentMenu } from "../ContentMenu";

vi.mock("@/hooks", () => ({
  useLocalStorage: vi.fn(),
}));

describe("ContentMenu Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sets isExtActive correctly based on localStorage value", async () => {
    // Create a mock implementation of getItem
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    // Render the component
    render(<ContentMenu />);

    // Verify that getItem was called with the correct key
    expect(mockGetItem).toHaveBeenCalledWith(
      GLOBAL_STINGS.EXT_ISACTIVE_LOCAL_STORAGE_KEY
    );

    // Check that the component is rendered (since isExtActive is true)
    const accordionElement = await screen.findByRole("accordion");
    expect(accordionElement).toBeInTheDocument();
  });

  it("does not render when isExtActive is false", async () => {
    // Create a mock implementation of getItem returning false
    const mockGetItem = vi.fn().mockResolvedValue("false");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    // Render the component
    const { container } = render(<ContentMenu />);

    // Verify that getItem was called with the correct key
    expect(mockGetItem).toHaveBeenCalledWith(
      GLOBAL_STINGS.EXT_ISACTIVE_LOCAL_STORAGE_KEY
    );

    // Check that no accordion is rendered
    const accordionElement = container.querySelector('[role="accordion"]');
    expect(accordionElement).toBeNull();
  });

  it("should render and display the menu", async () => {
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    render(<ContentMenu />);

    const accordion = await screen.findByRole("accordion");

    expect(accordion).toBeInTheDocument();
    expect(accordion.firstChild).toHaveAttribute("data-state", "closed");
  });

  it("should toggle the menu open/closed", async () => {
    const mockGetItem = vi.fn().mockResolvedValue("true");

    // Mock the useLocalStorage hook to return the mock getItem function
    vi.mocked(useLocalStorage).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clean: vi.fn(),
    });

    render(<ContentMenu />);

    const accordion = await screen.findByRole("accordion");

    fireEvent.click(accordion);
    setTimeout(() => {
      expect(accordion.firstChild).toHaveAttribute("data-state", "open");
    }, 200);

    fireEvent.click(accordion);
    expect(accordion.firstChild).toHaveAttribute("data-state", "closed");
  });
});
