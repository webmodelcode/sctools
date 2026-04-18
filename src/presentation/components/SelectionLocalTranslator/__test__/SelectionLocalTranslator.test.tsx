import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockSelectionTranslatorStatus = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockTargetLanguageStorage = {
  getItem: vi.fn(),
  setItem: vi.fn().mockResolvedValue(undefined),
  watchItem: vi.fn(),
};
let mockSelection: { text: string; rect: DOMRect } | null = null;
const mockTranslation = {
  status: "idle" as const,
  translatedText: null as string | null,
  sourceLanguage: null as string | null,
  errorMessage: undefined as string | undefined,
  translate: vi.fn().mockResolvedValue(undefined),
  reset: vi.fn(),
};

vi.mock(
  "~@/presentation/hooks/useSelectionTranslatorStatus/useSelectionTranslatorStatus",
  () => ({ useSelectionTranslatorStatus: () => mockSelectionTranslatorStatus }),
);
vi.mock(
  "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage",
  () => ({ useLocalTranslatorTargetLanguage: () => mockTargetLanguageStorage }),
);
vi.mock(
  "~@/presentation/components/SelectionLocalTranslator/hooks/useTextSelection",
  () => ({ useTextSelection: () => ({ selection: mockSelection, clearSelection: vi.fn() }) }),
);
vi.mock(
  "~@/presentation/components/SelectionLocalTranslator/hooks/useSelectionTranslation",
  () => ({ useSelectionTranslation: () => mockTranslation }),
);
vi.mock(
  "~@/presentation/components/SelectionLocalTranslator/SelectionBubble/SelectionBubble",
  () => ({
    SelectionBubble: ({ onHover }: { onHover: () => void }) => (
      <button data-testid="selection-bubble" onMouseEnter={onHover}>
        bubble
      </button>
    ),
  }),
);
vi.mock(
  "~@/presentation/components/SelectionLocalTranslator/SelectionTooltip/SelectionTooltip",
  () => ({
    SelectionTooltip: () => <div data-testid="selection-tooltip">tooltip</div>,
  }),
);

import { SelectionLocalTranslator } from "../SelectionLocalTranslator";

const mockRect = {
  top: 100,
  left: 200,
  bottom: 120,
  right: 400,
  width: 200,
  height: 20,
} as DOMRect;

describe("SelectionLocalTranslator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelection = null;
    mockSelectionTranslatorStatus.getItem.mockResolvedValue(false);
    mockSelectionTranslatorStatus.watchItem.mockImplementation(vi.fn());
    mockTargetLanguageStorage.getItem.mockResolvedValue("en");
    mockTargetLanguageStorage.watchItem.mockImplementation(vi.fn());
    mockTargetLanguageStorage.setItem.mockResolvedValue(undefined);
    mockTranslation.translate.mockResolvedValue(undefined);
    mockTranslation.reset.mockImplementation(vi.fn());
  });

  it("renders nothing when disabled", async () => {
    mockSelectionTranslatorStatus.getItem.mockResolvedValue(false);
    const { container } = render(<SelectionLocalTranslator />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("renders nothing when enabled but no selection", async () => {
    mockSelectionTranslatorStatus.getItem.mockResolvedValue(true);
    render(<SelectionLocalTranslator />);
    await waitFor(() => {
      expect(screen.queryByTestId("selection-bubble")).not.toBeInTheDocument();
    });
  });

  it("renders SelectionBubble when enabled and selection exists", async () => {
    mockSelectionTranslatorStatus.getItem.mockResolvedValue(true);
    mockSelection = { text: "hello world", rect: mockRect };
    render(<SelectionLocalTranslator />);
    await waitFor(() => {
      expect(screen.getByTestId("selection-bubble")).toBeInTheDocument();
    });
  });

  it("shows SelectionTooltip and calls translate on bubble hover", async () => {
    mockSelectionTranslatorStatus.getItem.mockResolvedValue(true);
    mockSelection = { text: "hello world", rect: mockRect };
    render(<SelectionLocalTranslator />);
    await waitFor(() => {
      expect(screen.getByTestId("selection-bubble")).toBeInTheDocument();
    });
    fireEvent.mouseEnter(screen.getByTestId("selection-bubble"));
    expect(screen.getByTestId("selection-tooltip")).toBeInTheDocument();
    expect(mockTranslation.translate).toHaveBeenCalledWith("hello world", "en");
  });
});
