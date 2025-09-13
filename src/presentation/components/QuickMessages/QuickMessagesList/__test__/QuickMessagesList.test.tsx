import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { QuickMessagesList } from "../QuickMessagesList";

// Mock the datasource
vi.mock("~@/infrastructure/datasource/quickMessages.local.datasource", () => ({
  getQuickMessages: vi.fn(),
  watchQuickMessages: vi.fn(),
  deleteQuickMessage: vi.fn(),
  getQuickMessageIndex: vi.fn(),
}));

// Mock QuickMessageOptions
vi.mock("../QuickMessageOptions/QuickMessageOptions", () => ({
  QuickMessageOptions: ({ label, msgId }: { label: string; msgId: string }) => (
    <div data-testid={`option-${label}`}>{label}</div>
  ),
}));

describe("QuickMessagesList.tsx", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render component when messages exist", async () => {
    const { getQuickMessages, watchQuickMessages } = await import(
      "~@/infrastructure/datasource/quickMessages.local.datasource"
    );
    
    const mockGetQuickMessages = vi.mocked(getQuickMessages);
    const mockWatchQuickMessages = vi.mocked(watchQuickMessages);
    
    const mockMessages = [
      { label: "test1", text: "Test message 1" },
      { label: "test2", text: "Test message 2" },
    ];
    
    mockGetQuickMessages.mockResolvedValue(mockMessages);
    mockWatchQuickMessages.mockImplementation(() => {});
    
    render(<QuickMessagesList />);
    
    await waitFor(() => {
      expect(screen.getByText("test1")).toBeInTheDocument();
      expect(screen.getByText("test2")).toBeInTheDocument();
    });
  });

  it("should not render when no messages exist", async () => {
    const { getQuickMessages, watchQuickMessages } = await import(
      "~@/infrastructure/datasource/quickMessages.local.datasource"
    );
    
    const mockGetQuickMessages = vi.mocked(getQuickMessages);
    const mockWatchQuickMessages = vi.mocked(watchQuickMessages);
    
    mockGetQuickMessages.mockResolvedValue([]);
    mockWatchQuickMessages.mockImplementation(() => {});
    
    const { container } = render(<QuickMessagesList />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("should render message options for each message", async () => {
    const { getQuickMessages, watchQuickMessages } = await import(
      "~@/infrastructure/datasource/quickMessages.local.datasource"
    );
    
    const mockGetQuickMessages = vi.mocked(getQuickMessages);
    const mockWatchQuickMessages = vi.mocked(watchQuickMessages);
    
    const mockMessages = [
      { label: "test1", text: "Test message 1" },
    ];
    
    mockGetQuickMessages.mockResolvedValue(mockMessages);
    mockWatchQuickMessages.mockImplementation(() => {});
    
    render(<QuickMessagesList />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("update quick message")).toBeInTheDocument();
      expect(screen.getByLabelText("delete quick message")).toBeInTheDocument();
    });
  });
});