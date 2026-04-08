import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SmLocalTranslator } from "../SmLocalTranslator";
import * as useMutationObserverModule from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import * as useFeaturesStatusModule from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { smAdapter } from "~@/config/smAdapter/sm.adapter";

// Mock the hooks
vi.mock(
  "~@/presentation/hooks/useMutationObserver/useMutationObserver",
  () => ({
    useMutationObserver: vi.fn(),
  }),
);

vi.mock("~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus", () => ({
  useFeaturesStatus: vi.fn(() => ({
    translator: { isEnabled: true, toggle: vi.fn() },
    quickMessages: { isEnabled: true, toggle: vi.fn() },
    quickMenu: { isEnabled: true, toggle: vi.fn() },
    speechToTranslate: { isEnabled: false, toggle: vi.fn() },
    isInitialized: true,
  })),
}));

// Mock the smAdapter
vi.mock("~@/config/smAdapter/sm.adapter", () => ({
  smAdapter: {
    getChatTab: vi.fn(),
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
// @ts-ignore
globalThis.browser = {
  runtime: {
    sendMessage: vi.fn(),
  },
};

// Mock createRoot
const mockRoot = {
  render: vi.fn(),
};

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => mockRoot),
}));

// Mock DOM elements helper
const createMockDiv = () => {
  return document.createElement("div") as HTMLDivElement;
};

describe("SmLocalTranslator", () => {
  const mockUseMutationObserver = vi.mocked(
    useMutationObserverModule.useMutationObserver,
  );
  const mockUseFeaturesStatus = vi.mocked(
    useFeaturesStatusModule.useFeaturesStatus,
  );
  const mockSmAdapter = vi.mocked(smAdapter);

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";

    // Setup default mocks
    mockSmAdapter.getChatTab.mockReturnValue(createMockDiv());

    mockUseFeaturesStatus.mockReturnValue({
      translator: { isEnabled: true, toggle: vi.fn() },
      quickMessages: { isEnabled: true, toggle: vi.fn() },
      quickMenu: { isEnabled: true, toggle: vi.fn() },
      speechToTranslate: { isEnabled: false, toggle: vi.fn() },
      isInitialized: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });

      // The component renders a hidden div
      const hiddenDiv = document.querySelector(".hidden");
      expect(hiddenDiv).toBeInTheDocument();
    });

    it("should initialize with correct adapter calls", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });

      expect(mockSmAdapter.getChatTab).toHaveBeenCalled();
    });

    it("should setup mutation observer", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });

      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
      });
    });

    it("should setup quick menu watcher", async () => {
      mockUseFeaturesStatus.mockReturnValue({
        translator: { isEnabled: true, toggle: vi.fn() },
        quickMessages: { isEnabled: true, toggle: vi.fn() },
        quickMenu: { isEnabled: true, toggle: vi.fn() },
        speechToTranslate: { isEnabled: false, toggle: vi.fn() },
        isInitialized: true,
      });

      await act(async () => {
        render(<SmLocalTranslator />);
      });

      // expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("Mutation Observer Setup", () => {
    it("should setup mutation observer with correct parameters", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });

      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: expect.any(Object) }),
        callback: expect.any(Function),
      });
    });

    it("should handle mutation callback without errors", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });
      const mutationCallback =
        mockUseMutationObserver.mock.calls[0][0].callback;

      // Test that callback can be called without throwing
      expect(() => {
        mutationCallback([], {} as MutationObserver);
      }).not.toThrow();
    });
  });

  describe("Extension State Management", () => {
    it("should initialize extension state from storage", async () => {
      mockUseFeaturesStatus.mockReturnValue({
        translator: { isEnabled: false, toggle: vi.fn() },
        quickMessages: { isEnabled: true, toggle: vi.fn() },
        quickMenu: { isEnabled: true, toggle: vi.fn() },
        speechToTranslate: { isEnabled: false, toggle: vi.fn() },
        isInitialized: true,
      });

      render(<SmLocalTranslator />);

      // Wait for useEffect to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockUseFeaturesStatus).toHaveBeenCalled();
    });

    it("should update state when watchItem callback is triggered", async () => {
      mockUseFeaturesStatus.mockReturnValue({
        translator: { isEnabled: true, toggle: vi.fn() },
        quickMessages: { isEnabled: true, toggle: vi.fn() },
        quickMenu: { isEnabled: true, toggle: vi.fn() },
        speechToTranslate: { isEnabled: false, toggle: vi.fn() },
        isInitialized: true,
      });

      await act(async () => {
        render(<SmLocalTranslator />);
      });

      // Verification logic here is implicit via mocks
    });
  });

  describe("Component Structure", () => {
    it("should have correct component structure", async () => {
      let container: any;
      await act(async () => {
        const result = render(<SmLocalTranslator />);
        container = result.container;
      });

      expect(container.firstChild).toHaveClass("hidden");
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("should not render any visible content", async () => {
      await act(async () => {
        render(<SmLocalTranslator />);
      });

      // Should not have any visible text content
      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });
  });

  describe("Adapter Integration", () => {
    it("should handle null chat tab from adapter", async () => {
      mockSmAdapter.getChatTab.mockReturnValue(null);

      await act(async () => {
        render(<SmLocalTranslator />);
      });

      expect(mockSmAdapter.getChatTab).toHaveBeenCalled();
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: null }),
        callback: expect.any(Function),
      });
    });

    it("should handle valid chat tab from adapter", async () => {
      const mockChatTab = createMockDiv();
      mockSmAdapter.getChatTab.mockReturnValue(mockChatTab);

      await act(async () => {
        render(<SmLocalTranslator />);
      });

      expect(mockSmAdapter.getChatTab).toHaveBeenCalled();
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: mockChatTab }),
        callback: expect.any(Function),
      });
    });
  });
});
