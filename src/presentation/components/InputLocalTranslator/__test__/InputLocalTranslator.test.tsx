import { render, screen } from "@testing-library/react";
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

// Get mocked functions
const mockUseFocusedElement = vi.mocked(useFocusedElement);
const mockUsePopupPosition = vi.mocked(usePopupPosition);
const mockUseInputValue = vi.mocked(useInputValue);

describe("InputLocalTranslator", () => {
  const mockElement = document.createElement("input");
  const mockPosition = { top: 100, left: 50, width: 200 };
  const mockInputValue = "test input value";

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe("when isVisible is true", () => {
    beforeEach(() => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should render TranslatorPopup component", () => {
      render(<InputLocalTranslator />);
      expect(screen.getByTestId("translator-popup")).toBeInTheDocument();
    });

    it("should pass correct position prop to TranslatorPopup", () => {
      render(<InputLocalTranslator />);
      const popup = screen.getByTestId("translator-popup");
      expect(popup).toHaveAttribute(
        "data-position",
        JSON.stringify(mockPosition),
      );
    });

    it("should pass correct inputValue prop to TranslatorPopup", () => {
      render(<InputLocalTranslator />);
      const popup = screen.getByTestId("translator-popup");
      expect(popup).toHaveAttribute("data-input-value", mockInputValue);
    });
  });

  describe("hook integration", () => {
    beforeEach(() => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);
    });

    it("should call useFocusedElement hook", () => {
      render(<InputLocalTranslator />);
      expect(mockUseFocusedElement).toHaveBeenCalledTimes(1);
    });

    it("should call usePopupPosition with correct parameters", () => {
      render(<InputLocalTranslator />);
      expect(mockUsePopupPosition).toHaveBeenCalledWith(mockElement, true);
    });

    it("should call useInputValue with correct parameters", () => {
      render(<InputLocalTranslator />);
      expect(mockUseInputValue).toHaveBeenCalledWith(mockElement);
    });
  });

  describe("edge cases", () => {
    it("should handle null focusedElement", () => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: null,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue("");

      render(<InputLocalTranslator />);
      expect(mockUsePopupPosition).toHaveBeenCalledWith(null, true);
      expect(mockUseInputValue).toHaveBeenCalledWith(null);
    });

    it("should handle empty inputValue", () => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue("");

      render(<InputLocalTranslator />);
      const popup = screen.getByTestId("translator-popup");
      expect(popup).toHaveAttribute("data-input-value", "");
    });

    it("should handle zero position values", () => {
      const zeroPosition = { top: 0, left: 0, width: 0 };
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(zeroPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      render(<InputLocalTranslator />);
      const popup = screen.getByTestId("translator-popup");
      expect(popup).toHaveAttribute(
        "data-position",
        JSON.stringify(zeroPosition),
      );
    });
  });

  describe("component lifecycle", () => {
    it("should create a ref for the popup", () => {
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      render(<InputLocalTranslator />);
      expect(mockUseFocusedElement).toHaveBeenCalled();
      expect(mockUsePopupPosition).toHaveBeenCalled();
      expect(mockUseInputValue).toHaveBeenCalled();
    });
  });

  describe("re-rendering behavior", () => {
    it("should re-render when isVisible changes from false to true", () => {
      // First render with isVisible false
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: false,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(mockPosition);
      mockUseInputValue.mockReturnValue(mockInputValue);

      const { rerender } = render(<InputLocalTranslator />);
      expect(screen.queryByTestId("translator-popup")).not.toBeInTheDocument();

      // Second render with isVisible true
      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      
      rerender(<InputLocalTranslator />);
      expect(screen.getByTestId("translator-popup")).toBeInTheDocument();
    });

    it("should render with different prop values", () => {
      const newInputValue = "updated input value";
      const newPosition = { top: 200, left: 100, width: 300 };

      mockUseFocusedElement.mockReturnValue({
        focusedElement: mockElement,
        isVisible: true,
        setIsVisible: vi.fn(),
      });
      mockUsePopupPosition.mockReturnValue(newPosition);
      mockUseInputValue.mockReturnValue(newInputValue);

      render(<InputLocalTranslator />);

      const popup = screen.getByTestId("translator-popup");
      expect(popup).toHaveAttribute(
        "data-position",
        JSON.stringify(newPosition),
      );
      expect(popup).toHaveAttribute("data-input-value", newInputValue);
    });
  });
});
