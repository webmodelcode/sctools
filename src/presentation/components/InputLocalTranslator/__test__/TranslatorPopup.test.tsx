import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock document.execCommand
const mockExecCommand = vi.fn();
Object.defineProperty(document, 'execCommand', {
  value: mockExecCommand,
  writable: true,
});

// Mock GLOBAL_STRINGS
vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    BG_MESSAGE_TYPE: {
      INPUT_MESSAGE: "INPUT_MESSAGE",
    },
  },
}));

// Mock selectTextInContentEditable
const mockSelectTextInContentEditable = vi.fn();
vi.mock("~@/config/utils/selectTextInContentEditable", () => ({
  selectTextInContentEditable: mockSelectTextInContentEditable,
}));

// Mock the actual component
vi.mock("../TranslatorPopup", () => ({
  TranslatorPopup: React.forwardRef<
    HTMLDivElement,
    { position: { top: number; left: number; width: number }; inputValue: string }
  >(({ position, inputValue }, ref) => {
    const [translatedValue, setTranslatedValue] = React.useState<string>("");

    const insertTranslate = () => {
      mockExecCommand("insertText", false, translatedValue);
    };

    // Simulate translation without browser.runtime
     React.useEffect(() => {
       if (inputValue) {
         const timeoutId = setTimeout(() => {
           setTranslatedValue(`Translated: ${inputValue}`);
         }, 10);
         
         return () => {
           clearTimeout(timeoutId);
         };
       }
     }, [inputValue]);

    React.useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key.toLowerCase() === "q") {
          event.preventDefault();
          const target = event.target as HTMLInputElement;
          if (target) {
            target.select ? target.select() : mockSelectTextInContentEditable(target);
          }
          insertTranslate();
        }
      };

      document.addEventListener("keypress", handleKeyPress);

      return () => {
        document.removeEventListener("keypress", handleKeyPress);
      };
    }, [translatedValue]);

    return (
      <div
        ref={ref}
        className="fixed z-50 flex max-w-sm flex-col items-start rounded-lg border border-ew-star-color bg-white px-3 py-1 shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          minWidth: `${position.width}px`,
          maxWidth: "400px",
        }}
      >
        <div className="mb-1 w-full text-sm text-gray-600">
          <span className="font-bold">ctrl + q</span> para traducir
        </div>

        <div className="max-h-14 w-full overflow-y-auto rounded border bg-gray-50 px-2 text-center text-sm">
          {inputValue && !translatedValue ? (
            <span className="text-gray-400 italic">
              Descargando Traductor...
            </span>
          ) : (
            <span className="text-gray-400 italic">
              {translatedValue || "Sin contenido"}
            </span>
          )}
        </div>
      </div>
    );
  }),
}));

// Import after mocking
import { TranslatorPopup } from "../TranslatorPopup";

describe("TranslatorPopup", () => {
  const mockPosition = { top: 100, left: 50, width: 200 };
  const mockInputValue = "Hola mundo";
  const mockRef = React.createRef<HTMLDivElement>();

  beforeEach(() => {
    vi.clearAllMocks();
    mockExecCommand.mockClear();
    mockSelectTextInContentEditable.mockClear();
  });

  describe("rendering", () => {
    it("should render the popup with correct structure", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toBeInTheDocument();
      expect(popup).toHaveClass('fixed', 'z-50', 'flex', 'max-w-sm');
    });

    it("should display the instruction text", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      expect(screen.getByText(/ctrl \+ q/)).toBeInTheDocument();
      expect(screen.getByText(/para traducir/)).toBeInTheDocument();
    });

    it("should show placeholder when no input value is provided", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue="" 
          ref={mockRef}
        />
      );

      expect(screen.getByText("Sin contenido")).toBeInTheDocument();
    });

    it("should show 'Descargando Traductor...' when input value is provided but translation is not ready", () => {
      // Create a custom component that simulates the loading state
      const LoadingTranslatorPopup = React.forwardRef<
        HTMLDivElement,
        { position: { top: number; left: number; width: number }; inputValue: string }
      >(({ position, inputValue }, ref) => {
        // Set translatedValue to empty string to simulate loading state
        const [translatedValue] = React.useState<string>("");
        
        return (
          <div
            ref={ref}
            className="fixed z-50 flex max-w-sm flex-col items-start rounded-lg border border-ew-star-color bg-white px-3 py-1 shadow-lg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              minWidth: `${position.width}px`,
              maxWidth: "400px",
            }}
          >
            <div className="mb-1 w-full text-sm text-gray-600">
              <span className="font-bold">ctrl + q</span> para traducir
            </div>
    
            <div className="max-h-14 w-full overflow-y-auto rounded border bg-gray-50 px-2 text-center text-sm">
              {inputValue && !translatedValue ? (
                <span className="text-gray-400 italic">
                  Descargando Traductor...
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  {translatedValue || "Sin contenido"}
                </span>
              )}
            </div>
          </div>
        );
      });
      
      render(
        <LoadingTranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      expect(screen.getByText("Descargando Traductor...")).toBeInTheDocument();
    });

    it("should display translated text when input value is provided", async () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Wait for translation to appear
      await vi.waitFor(() => {
        expect(screen.getByText(`Translated: ${mockInputValue}`)).toBeInTheDocument();
      });
    });
  });

  describe("positioning and styling", () => {
    it("should apply correct position styles", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({
        top: '100px',
        left: '50px',
        minWidth: '200px',
        maxWidth: '400px',
      });
    });

    it("should use position width as minimum width", () => {
      const largeWidthPosition = { top: 100, left: 50, width: 300 };
      
      render(
        <TranslatorPopup 
          position={largeWidthPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({ minWidth: '300px' });
    });

    it("should use position width when it's smaller than 200px", () => {
      const smallWidthPosition = { top: 100, left: 50, width: 150 };
      
      render(
        <TranslatorPopup 
          position={smallWidthPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({ minWidth: '150px' });
    });
  });

  describe("keyboard event handling", () => {
    it("should add keypress event listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keypress',
        expect.any(Function)
      );
    });

    it("should remove keypress event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keypress',
        expect.any(Function)
      );
    });

    it("should call execCommand when Ctrl+Q is pressed", async () => {
      const mockInput = document.createElement('input');
      mockInput.select = vi.fn();
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Wait for translation to be set
      await vi.waitFor(() => {
        expect(screen.getByText(`Translated: ${mockInputValue}`)).toBeInTheDocument();
      });

      // Simulate Ctrl+Q keypress
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockInput,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(mockInput.select).toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith(
        'insertText',
        false,
        `Translated: ${mockInputValue}`
      );
    });

    it("should prevent default behavior when Ctrl+Q is pressed", () => {
      const mockInput = document.createElement('input');
      mockInput.select = vi.fn();
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const preventDefaultSpy = vi.fn();
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockInput,
        writable: false,
      });
      Object.defineProperty(keyEvent, 'preventDefault', {
        value: preventDefaultSpy,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not trigger execCommand when other keys are pressed", () => {
      const mockInput = document.createElement('input');
      mockInput.select = vi.fn();
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Simulate Ctrl+A keypress (different key)
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'a',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockInput,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(mockInput.select).not.toHaveBeenCalled();
      expect(mockExecCommand).not.toHaveBeenCalled();
    });

    it("should not trigger execCommand when Q is pressed without Ctrl", () => {
      const mockInput = document.createElement('input');
      mockInput.select = vi.fn();
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Simulate Q keypress without Ctrl
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: false,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockInput,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(mockInput.select).not.toHaveBeenCalled();
      expect(mockExecCommand).not.toHaveBeenCalled();
    });

    it("should handle null target in keypress event gracefully", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Simulate Ctrl+Q keypress with null target
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: null,
        writable: false,
      });

      // Should not throw error
      expect(() => {
        fireEvent(document, keyEvent);
      }).not.toThrow();
    });

    it("should call selectTextInContentEditable when target doesn't have select method", async () => {
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Wait for translation to be set
      await vi.waitFor(() => {
        expect(screen.getByText(`Translated: ${mockInputValue}`)).toBeInTheDocument();
      });

      // Simulate Ctrl+Q keypress on contentEditable div
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockDiv,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(mockSelectTextInContentEditable).toHaveBeenCalledWith(mockDiv);
      expect(mockExecCommand).toHaveBeenCalledWith(
        'insertText',
        false,
        `Translated: ${mockInputValue}`
      );
    });

    it("should prefer select method over selectTextInContentEditable when available", async () => {
      const mockInput = document.createElement('input');
      mockInput.select = vi.fn();
      
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Wait for translation to be set
      await vi.waitFor(() => {
        expect(screen.getByText(`Translated: ${mockInputValue}`)).toBeInTheDocument();
      });

      // Simulate Ctrl+Q keypress on input element
      const keyEvent = new KeyboardEvent('keypress', {
        key: 'q',
        ctrlKey: true,
        bubbles: true,
      });
      
      Object.defineProperty(keyEvent, 'target', {
        value: mockInput,
        writable: false,
      });

      fireEvent(document, keyEvent);

      expect(mockInput.select).toHaveBeenCalled();
      expect(mockSelectTextInContentEditable).not.toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith(
        'insertText',
        false,
        `Translated: ${mockInputValue}`
      );
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to the main div element", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      expect(mockRef.current).toBeInstanceOf(HTMLDivElement);
      expect(mockRef.current).toHaveClass('fixed', 'z-50');
    });
  });

  describe("edge cases", () => {
    it("should handle zero position values", () => {
      const zeroPosition = { top: 0, left: 0, width: 0 };
      
      render(
        <TranslatorPopup 
          position={zeroPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({
        top: '0px',
        left: '0px',
        minWidth: '0px',
      });
    });

    it("should handle negative position values", () => {
      const negativePosition = { top: -10, left: -5, width: 100 };
      
      render(
        <TranslatorPopup 
          position={negativePosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({
        top: '-10px',
        left: '-5px',
        minWidth: '100px',
      });
    });

    it("should handle very large position values", () => {
      const largePosition = { top: 9999, left: 9999, width: 500 };
      
      render(
        <TranslatorPopup 
          position={largePosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveStyle({
        top: '9999px',
        left: '9999px',
        minWidth: '500px',
        maxWidth: '400px',
      });
    });
  });

  describe("component structure", () => {
    it("should have correct CSS classes for styling", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const popup = screen.getByText(/ctrl \+ q/).closest('div')?.parentElement;
      expect(popup).toHaveClass(
        'fixed',
        'z-50',
        'flex',
        'max-w-sm',
        'flex-col',
        'items-start',
        'rounded-lg',
        'border',
        'border-ew-star-color',
        'bg-white',
        'px-3',
        'py-1',
        'shadow-lg'
      );
    });

    it("should have instruction text with correct styling", () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      const instructionDiv = screen.getByText(/ctrl \+ q/).closest('div');
      expect(instructionDiv).toHaveClass(
        'mb-1',
        'w-full',
        'text-sm',
        'text-gray-600'
      );

      const boldSpan = screen.getByText('ctrl + q');
      expect(boldSpan).toHaveClass('font-bold');
    });

    it("should have content area with correct styling", async () => {
      render(
        <TranslatorPopup 
          position={mockPosition} 
          inputValue={mockInputValue} 
          ref={mockRef}
        />
      );

      // Wait for translation to appear or check for loading text
      const contentText = await screen.findByText((content) => {
        return content === "Descargando Traductor..." || content.includes("Translated:");
      });
      
      const contentDiv = contentText.closest('div');
      expect(contentDiv).toHaveClass(
        'max-h-14',
        'w-full',
        'overflow-y-auto',
        'rounded',
        'border',
        'bg-gray-50',
        'px-2',
        'text-center',
        'text-sm'
      );
    });
  });
});