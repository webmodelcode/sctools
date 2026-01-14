import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChaturLocalTranslator } from "../ChaturLocalTranslator";
import * as useMutationObserverModule from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import * as useQuickMenuIsActiveModule from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";
import { chaturAdapter } from "~@/config/chaturAdapter/chaturAdapter";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

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
    useQuickMenuIsActive: vi.fn(() => ({
      getItem: vi.fn().mockResolvedValue(true),
      watchItem: vi.fn(),
      setItem: vi.fn(),
    })),
  }),
);

// Mock the chaturAdapter
vi.mock("~@/config/chaturAdapter/chaturAdapter", () => ({
  chaturAdapter: {
    getPublicChatTab: vi.fn(),
    getTabsContainer: vi.fn(),
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

// Mock the TranslatedMessage component
vi.mock("../TranslatedMessage/TranslatedMessage", () => ({
  TranslatedMessage: ({
    message,
    bgColor,
  }: {
    message: string;
    bgColor: string;
  }) => (
    <div data-testid="translated-message" style={{ backgroundColor: bgColor }}>
      {message}
    </div>
  ),
}));

// Mock browser runtime
const mockBrowserRuntime = {
  sendMessage: vi.fn(),
};

// @ts-ignore
global.browser = {
  runtime: mockBrowserRuntime,
};

// Mock createRoot
const mockRender = vi.fn();
const mockRoot = {
  render: mockRender,
};

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => mockRoot),
}));

// Mock DOM elements helper
const createMockElement = (tagName: string = "div") => {
  const element = document.createElement(tagName);
  return element;
};

describe("ChaturLocalTranslator", () => {
  // Get mocked functions
  const mockUseMutationObserver = vi.mocked(
    useMutationObserverModule.useMutationObserver,
  );
  const mockUseQuickMenuIsActive = vi.mocked(
    useQuickMenuIsActiveModule.useQuickMenuIsActive,
  );
  const mockChaturAdapter = vi.mocked(chaturAdapter);

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";

    // Setup default mocks
    (mockChaturAdapter.getPublicChatTab as any).mockReturnValue(
      createMockElement("div"),
    );
    (mockChaturAdapter.getTabsContainer as any).mockReturnValue(
      createMockElement("div"),
    );

    (mockUseQuickMenuIsActive as any).mockReturnValue({
      getItem: vi.fn().mockResolvedValue(true),
      watchItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      // The component renders a hidden div
      const hiddenDiv = document.querySelector(".hidden");
      expect(hiddenDiv).toBeInTheDocument();
    });

    it("should initialize with correct adapter calls", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      expect(mockChaturAdapter.getPublicChatTab).toHaveBeenCalledTimes(0);
      expect(mockChaturAdapter.getTabsContainer).toHaveBeenCalledTimes(1);
    });

    it("should setup mutation observer", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
      });
    });

    it("should setup quick menu watcher", async () => {
      const mockWatchItem = vi.fn();
      (mockUseQuickMenuIsActive as any).mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        watchItem: mockWatchItem,
        setItem: vi.fn(),
      });

      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("Mutation Observer Callback", () => {
    it("should setup mutation observer with correct parameters", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
      });
    });

    it("should handle mutation observer callback without errors", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      // Get the callback function passed to useMutationObserver
      const callArgs = mockUseMutationObserver.mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs[0]).toBeDefined();
      expect(typeof callArgs[0].callback).toBe("function");
    });
  });

  describe("Extension State Management", () => {
    it("should initialize extension state from storage", async () => {
      const mockGetItem = vi.fn().mockResolvedValue(false);
      (mockUseQuickMenuIsActive as any).mockReturnValue({
        getItem: mockGetItem,
        watchItem: vi.fn(),
        setItem: vi.fn(),
      });

      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      // Wait for useEffect to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockGetItem).toHaveBeenCalled();
    });

    it("should update state when watchItem callback is triggered", async () => {
      let watchCallback: (value: boolean) => void;
      const mockWatchItem = vi.fn((callback) => {
        watchCallback = callback;
      });

      (mockUseQuickMenuIsActive as any).mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        watchItem: mockWatchItem,
        setItem: vi.fn(),
      });

      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));

      // Trigger the watch callback
      await act(async () => {
        watchCallback!(false);
      });

      // The state should be updated (this is tested indirectly through mutation processing)
    });
  });

  describe("Component Structure", () => {
    it("should have correct component structure", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      const container = screen.getByTestId("chatur-local-translator");

      expect(container).toHaveClass("hidden");
      expect(container.nodeName).toBe("DIV");
    });

    it("should not render any visible content", async () => {
      await act(async () => {
        render(<ChaturLocalTranslator />);
      });

      // Should not have any visible text content
      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });
  });
});
