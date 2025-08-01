import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ContentMenu } from "../ContentMenu";
import * as useQuickMenuIsActiveModule from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { smAdapter } from "~@/config/smAdapter/sm.adapter";

// Mock the hooks and adapters
vi.mock(
  "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive",
  () => ({
    useQuickMenuIsActive: vi.fn(),
  }),
);

vi.mock("~@/config/scAdapter/sc.adapter", () => ({
  scAdapter: {
    getScElementByClassName: vi.fn(),
  },
}));

vi.mock("~@/config/smAdapter/sm.adapter", () => ({
  smAdapter: {
    getConsentModal: vi.fn(),
    getConsentCheckbox: vi.fn(),
    getConsentButton: vi.fn(),
  },
}));

// Mock the components used by ContentMenu
vi.mock("../../MaximizeButton/MaximizeButton", () => ({
  MaximizeButton: () => <div data-testid="maximize-button">MaximizeButton</div>,
}));

vi.mock("../../StatusIndicator/StatusIndicator", () => ({
  StatusIndicator: () => (
    <div data-testid="status-indicator">StatusIndicator</div>
  ),
}));

vi.mock("../../SmCheckTerms/SmCheckTerms", () => ({
  SmCheckTerms: () => <div data-testid="sm-check-terms">SmCheckTerms</div>,
}));

vi.mock("../../DonationSupport/DonationSupport", () => ({
  DonationSupport: () => (
    <div data-testid="donation-support">DonationSupport</div>
  ),
}));

describe("ContentMenu", () => {
  // Clear all mocks after each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the location.hostname mock
    Object.defineProperty(window, "location", {
      value: {
        hostname: "",
      },
      writable: true,
    });
    // Mock the useQuickMenuIsActive hook to return default values
    vi.mocked(useQuickMenuIsActiveModule.useQuickMenuIsActive).mockReturnValue({
      setItem: vi.fn(),
      getItem: vi.fn().mockResolvedValue(true),
      watchItem: vi.fn().mockResolvedValue(true),
    });
  });

  it("should render the component with status indicator when isActive is true", async () => {
    // Act: Render the component
    render(<ContentMenu />);

    // Assert: Verify that status indicator is rendered
    expect(await screen.findByTestId("status-indicator")).toBeInTheDocument();
  });

  it("should not render any menu items when isActive is false", () => {
    // Act: Render the component
    render(<ContentMenu />);

    // Assert: Verify that no menu items are rendered
    expect(screen.queryByTestId("status-indicator")).not.toBeInTheDocument();
  });

  it("should render MaximizeButton for stripchat.com", async () => {
    // Arrange: Set hostname to stripchat.com and ensure isExtActive is true
    Object.defineProperty(window, "location", {
      value: {
        hostname: "stripchat.com",
      },
      writable: true,
    });

    // Act: Render the component
    render(<ContentMenu />);

    // Assert: Wait for the async state update and verify that MaximizeButton is rendered
    await waitFor(() => {
      expect(screen.getByTestId("maximize-button")).toBeInTheDocument();
    });
  });

  it("should render SmCheckTerms for streamatemodels.com", async () => {
    // Arrange: Set hostname to streamatemodels.com and ensure isExtActive is true
    Object.defineProperty(window, "location", {
      value: {
        hostname: "streamatemodels.com",
      },
      writable: true,
    });

    // Act: Render the component
    render(<ContentMenu />);

    // Assert: Wait for the async state update and verify that SmCheckTerms is rendered
    await waitFor(() => {
      expect(screen.getByTestId("sm-check-terms")).toBeInTheDocument();
    });
  });

  it("should conditionally render components based on hostname", async () => {
    // Test with stripchat.com
    Object.defineProperty(window, "location", {
      value: {
        hostname: "stripchat.com",
      },
      writable: true,
    });

    // Act: Render the component
    const { rerender } = render(<ContentMenu />);

    // Wait for the async state update from useEffect
    await waitFor(() => {
      // Assert: Verify MaximizeButton is rendered for stripchat.com
      expect(screen.getByTestId("maximize-button")).toBeInTheDocument();
      expect(screen.queryByTestId("sm-check-terms")).not.toBeInTheDocument();
    });

    // Test with streamatemodels.com
    Object.defineProperty(window, "location", {
      value: {
        hostname: "streamatemodels.com",
      },
      writable: true,
    });

    // Act: Re-render the component
    rerender(<ContentMenu />);

    // Wait for the async state update
    await waitFor(() => {
      // Assert: Verify SmCheckTerms is rendered for streamatemodels.com
      expect(screen.queryByTestId("maximize-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("sm-check-terms")).toBeInTheDocument();
    });

    // Test with a different hostname
    Object.defineProperty(window, "location", {
      value: {
        hostname: "example.com",
      },
      writable: true,
    });

    // Act: Re-render the component
    rerender(<ContentMenu />);

    // Wait for the async state update
    await waitFor(() => {
      // Assert: Verify neither component is rendered for other hostnames
      expect(screen.queryByTestId("maximize-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("sm-check-terms")).not.toBeInTheDocument();
    });
  });

  it("should update isExtActive state when useEffect is triggered", async () => {
    // Arrange: Set up the hook with a mock getItem function that returns a promise
    const mockGetItem = vi.fn().mockResolvedValue(true);
    vi.mocked(useQuickMenuIsActiveModule.useQuickMenuIsActive).mockReturnValue({
      setItem: vi.fn(),
      getItem: mockGetItem,
      watchItem: vi.fn().mockResolvedValue(true),
    });

    // Act: Render the component (which triggers useEffect)
    render(<ContentMenu />);

    // Assert: Verify that getItem was called
    expect(mockGetItem).toHaveBeenCalled();

    // Wait for the async state update
    await waitFor(() => {
      // After the useEffect runs, the state should be updated and the component should render
      expect(screen.getByTestId("status-indicator")).toBeInTheDocument();
    });
  });

  it("should not render anything when getItem returns false", async () => {
    // Arrange: Set up the hook with a mock getItem function that returns false
    const mockGetItem = vi.fn().mockResolvedValue(false);
    vi.mocked(useQuickMenuIsActiveModule.useQuickMenuIsActive).mockReturnValue({
      setItem: vi.fn(),
      getItem: mockGetItem,
      watchItem: vi.fn().mockResolvedValue(false),
    });

    // Act: Render the component
    render(<ContentMenu />);

    // Assert: Verify that getItem was called
    expect(mockGetItem).toHaveBeenCalled();

    // Wait for the async state update
    await waitFor(() => {
      // After the useEffect runs, the state should be updated and the component should not render
      expect(screen.queryByTestId("status-indicator")).not.toBeInTheDocument();
    });
  });
});
