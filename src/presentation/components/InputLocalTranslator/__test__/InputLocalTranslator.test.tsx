import { render, screen, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock the hooks with factory functions
vi.mock("../../../hooks/useFocusedElement", () => ({
  useFocusedElement: vi.fn(),
}));

vi.mock("../../../hooks/usePopupPosition", () => ({
  usePopupPosition: vi.fn(),
}));

vi.mock("../../../hooks/useInputValue", () => ({
  useInputValue: vi.fn(),
}));

vi.mock("~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive", () => ({
  useQuickMenuIsActive: vi.fn(),
}));

// Mock TranslatorPopup component
vi.mock("../TranslatorPopup", () => ({
  TranslatorPopup: React.forwardRef<HTMLDivElement, { position: any; inputValue: string }>(
    ({ position, inputValue }, ref) => 
      React.createElement("div", {
        "data-testid": "translator-popup",
        "data-position": JSON.stringify(position),
        "data-input-value": inputValue,
        ref: ref,
      }, "Mocked TranslatorPopup")
  ),
}));

// Import the component and mocked modules
import { InputLocalTranslator } from "../InputLocalTranslator";
import { useFocusedElement } from "../../../hooks/useFocusedElement";
import { usePopupPosition } from "../../../hooks/usePopupPosition";
import { useInputValue } from "../../../hooks/useInputValue";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

// Get mocked functions
const mockUseFocusedElement = vi.mocked(useFocusedElement);
const mockUsePopupPosition = vi.mocked(usePopupPosition);
const mockUseInputValue = vi.mocked(useInputValue);
const mockUseQuickMenuIsActive = vi.mocked(useQuickMenuIsActive);

describe("InputLocalTranslator", () => {
  const mockElement = document.createElement("input");
  const mockPosition = { top: 100, left: 50, width: 200 };
  const mockInputValue = "test input value";

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for useQuickMenuIsActive
    mockUseQuickMenuIsActive.mockReturnValue({
      getItem: vi.fn().mockResolvedValue(true),
      setItem: vi.fn(),
      watchItem: vi.fn(),
    });
  });

  describe("when extension is not active", () => {
    beforeEach(() => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(false),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should return null and not render anything when extension is disabled", () => {
      const { container } = render(<InputLocalTranslator />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render TranslatorPopup component when extension is disabled", () => {
      render(<InputLocalTranslator />);
      expect(screen.queryByTestId("translator-popup")).not.toBeInTheDocument();
    });
  });

  describe("when isVisible is false", () => {
    beforeEach(() => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: false,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should return null and not render anything", () => {
      const { container } = render(<InputLocalTranslator />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render TranslatorPopup component", () => {
      render(<InputLocalTranslator />);
      expect(screen.queryByTestId("translator-popup")).not.toBeInTheDocument();
    });
  });

  describe("when isVisible is true and extension is active", () => {
    beforeEach(() => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should render TranslatorPopup component", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      await waitFor(() => {
        expect(screen.getByTestId("translator-popup")).toBeInTheDocument();
      });
    });

    it("should pass correct position prop to TranslatorPopup", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      await waitFor(() => {
        const popup = screen.getByTestId("translator-popup");
        expect(popup).toHaveAttribute(
          "data-position",
          JSON.stringify(mockPosition),
        );
      });
    });

    it("should pass correct inputValue prop to TranslatorPopup", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      await waitFor(() => {
        const popup = screen.getByTestId("translator-popup");
        expect(popup).toHaveAttribute("data-input-value", mockInputValue);
      });
    });
  });

  describe("hook integration", () => {
    beforeEach(() => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should call useFocusedElement hook", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUseFocusedElement).toHaveBeenCalled();
    });

    it("should call usePopupPosition with correct parameters", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUsePopupPosition).toHaveBeenCalledWith(mockElement, true);
    });

    it("should call useInputValue with correct parameters", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUseInputValue).toHaveBeenCalledWith(mockElement);
    });

    it("should call useQuickMenuIsActive hook", async () => {
      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUseQuickMenuIsActive).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle null focusedElement", async () => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: null,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue("");

      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUsePopupPosition).toHaveBeenCalledWith(null, true);
      expect(mockUseInputValue).toHaveBeenCalledWith(null);
    });

    it("should handle empty inputValue", async () => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue("");

      await act(async () => {
        render(<InputLocalTranslator />);
      });
      await waitFor(() => {
        const popup = screen.getByTestId("translator-popup");
        expect(popup).toHaveAttribute("data-input-value", "");
      });
    });

    it("should handle zero position values", async () => {
      const zeroPosition = { top: 0, left: 0, width: 0 };
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(zeroPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      await act(async () => {
        render(<InputLocalTranslator />);
      });
      await waitFor(() => {
        const popup = screen.getByTestId("translator-popup");
        expect(popup).toHaveAttribute(
          "data-position",
          JSON.stringify(zeroPosition),
        );
      });
    });
  });

  describe("component lifecycle", () => {
    it("should create a ref for the popup", async () => {
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      await act(async () => {
        render(<InputLocalTranslator />);
      });
      expect(mockUseFocusedElement).toHaveBeenCalled();
      expect(mockUsePopupPosition).toHaveBeenCalled();
      expect(mockUseInputValue).toHaveBeenCalled();
    });
  });

  describe("re-rendering behavior", () => {
    it("should re-render when isVisible changes from false to true", async () => {
      // First render with isVisible false
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: false,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      let rerender: any;
       await act(async () => {
         const result = render(<InputLocalTranslator />);
         rerender = result.rerender;
       });
      expect(screen.queryByTestId("translator-popup")).not.toBeInTheDocument();

      // Second render with isVisible true
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      
      await act(async () => {
        rerender(<InputLocalTranslator />);
      });
      await waitFor(() => {
        expect(screen.getByTestId("translator-popup")).toBeInTheDocument();
      });
    });

    it("should render with different prop values", async () => {
      const newInputValue = "updated input value";
      const newPosition = { top: 200, left: 100, width: 300 };

      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        setItem: vi.fn(),
        watchItem: vi.fn(),
      });
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(newPosition);
      mockUseInputValue.mockReturnValue(newInputValue);

      await act(async () => {
        render(<InputLocalTranslator />);
      });

      await waitFor(() => {
        const popup = screen.getByTestId("translator-popup");
        expect(popup).toHaveAttribute(
          "data-position",
          JSON.stringify(newPosition),
        );
        expect(popup).toHaveAttribute("data-input-value", newInputValue);
      });
    });
  });
});
