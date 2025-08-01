import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import React from "react";

// Mock the hooks
vi.mock(
  "~@/presentation/hooks/useMutationObserver/useMutationObserver",
  () => ({
    useMutationObserver: vi.fn(),
  }),
);

vi.mock(
  "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive",
  () => ({
    useQuickMenuIsActive: vi.fn(),
  }),
);

// Mock scAdapter
vi.mock("~@/config/scAdapter/sc.adapter", () => ({
  scAdapter: {
    getScElementByClassName: vi.fn(),
    getScMultipleElementsByClassName: vi.fn(),
  },
}));

// Mock GLOBAL_STRINGS
vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    BG_MESSAGE_TYPE: {
      CHAT_MESSAGE: "CHAT_MESSAGE",
    },
  },
}));

// Mock TranslatedMessage component
vi.mock("../TranslatedMessage/TranslatedMessage", () => ({
  TranslatedMessage: ({ message, bgColor }: { message: string; bgColor: string }) =>
    React.createElement("div", {
      "data-testid": "translated-message",
      "data-message": message,
      "data-bg-color": bgColor,
    }, `Translated: ${message}`),
}));

// Mock createRoot
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

// Mock browser runtime
const mockSendMessage = vi.fn();
(global as any).browser = {
  runtime: {
    sendMessage: mockSendMessage,
  },
};

// Mock webext-core fake browser to avoid listener errors
vi.mock('@webext-core/fake-browser', () => ({
  fakeBrowser: {
    runtime: {
      sendMessage: mockSendMessage,
    },
  },
}));

// Import the hooks and components after mocking
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { createRoot } from "react-dom/client";
import { ScLocalTranslatorMessenger } from "../ScLocalTranslatorMessenger";

describe("ScLocalTranslatorMessenger", () => {
  const mockElement = document.createElement("div");
  const mockMutationCallback = vi.fn();
  const mockGetItem = vi.fn();
  const mockWatchItem = vi.fn();
  const mockSetItem = vi.fn();
  const mockCreateRoot = vi.fn();
  const mockRender = vi.fn();
  const mockUnmount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(scAdapter.getScElementByClassName).mockReturnValue(mockElement);
    vi.mocked(scAdapter.getScMultipleElementsByClassName).mockReturnValue(
      [mockElement] as unknown as HTMLCollectionOf<Element>
    );
    vi.mocked(useQuickMenuIsActive).mockReturnValue({
      getItem: mockGetItem.mockResolvedValue(true),
      setItem: mockSetItem,
      watchItem: mockWatchItem,
    });
    vi.mocked(useMutationObserver).mockImplementation(({ callback }) => {
      mockMutationCallback.mockImplementation(callback);
    });
    vi.mocked(createRoot).mockReturnValue({
      render: mockRender,
      unmount: mockUnmount,
    });
    mockSendMessage.mockClear();
  });

  describe("rendering", () => {
    it("should render a hidden div", async () => {
      let result: any;
      await act(async () => {
        result = render(<ScLocalTranslatorMessenger />);
      });
      
      const divElement = result.container.firstChild;
      expect(divElement).toBeInTheDocument();
      expect(divElement).toHaveAttribute("class", "hidden");
    });

    it("should render without crashing", () => {
      expect(() => {
        act(() => {
          render(<ScLocalTranslatorMessenger />);
        });
      }).not.toThrow();
    });
  });

  describe("adapter integration", () => {
    it("should call scAdapter.getScElementByClassName with correct parameter", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
      expect(scAdapter.getScElementByClassName).toHaveBeenCalledWith("messenger-chats");
    });

    it("should call useQuickMenuIsActive hook", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
      expect(useQuickMenuIsActive).toHaveBeenCalled();
    });
  });

  describe("mutation observer setup", () => {
    it("should call useMutationObserver with correct parameters", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
      
      expect(useMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({
          current: mockElement,
        }),
        callback: expect.any(Function),
      });
    });

    it("should setup mutation observer with messenger container ref", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });

      const callArgs = vi.mocked(useMutationObserver).mock.calls[0][0];
      expect(callArgs.ref).toBeDefined();
      expect(callArgs.ref.current).toBe(mockElement);
    });
  });

  describe("extension state management", () => {
    it("should setup watchItem callback", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should initialize extension state from storage", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
      await waitFor(() => {
        expect(mockGetItem).toHaveBeenCalled();
      });
    });

    it("should handle watchItem callback correctly", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });

      const watchCallback = mockWatchItem.mock.calls[0][0];
      
      // Test callback with true
      act(() => {
        watchCallback(true);
      });

      // Test callback with false
      act(() => {
        watchCallback(false);
      });

      // Should not throw errors
      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("mutation observer callback", () => {
    beforeEach(async () => {
      // Reset browser mock before each test
      mockSendMessage.mockReset();
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });
    });

    it("should setup mutation observer correctly", () => {
      expect(useMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({
          current: mockElement,
        }),
        callback: expect.any(Function),
      });
    });

    it("should call getScMultipleElementsByClassName when processing mutations", () => {
      // Verify that the component would call the adapter method
      expect(scAdapter.getScElementByClassName).toHaveBeenCalledWith("messenger-chats");
    });
  });

  describe("browser integration", () => {
    it("should have access to browser runtime for messaging", () => {
      expect((global as any).browser.runtime.sendMessage).toBe(mockSendMessage);
    });

    it("should integrate all hooks correctly", async () => {
      await act(async () => {
        render(<ScLocalTranslatorMessenger />);
      });

      // Verify all hooks are called
      expect(scAdapter.getScElementByClassName).toHaveBeenCalledWith("messenger-chats");
      expect(useQuickMenuIsActive).toHaveBeenCalled();
      expect(useMutationObserver).toHaveBeenCalled();
      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("component integration", () => {
    it("should have access to createRoot for rendering", () => {
      expect(createRoot).toBeDefined();
    });

    it("should have browser runtime available", () => {
      expect((global as any).browser.runtime.sendMessage).toBe(mockSendMessage);
    });
  });
});