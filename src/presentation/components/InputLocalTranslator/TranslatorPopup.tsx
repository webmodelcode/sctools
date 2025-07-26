import { forwardRef } from "react";

interface PopupPosition {
  top: number;
  left: number;
  width: number;
}

interface TranslatorPopupProps {
  position: PopupPosition;
  inputValue: string;
}

export const TranslatorPopup = forwardRef<HTMLDivElement, TranslatorPopupProps>(
  ({ position, inputValue }, ref) => {
    return (
      <div
        ref={ref}
        className="fixed z-50 max-w-sm rounded-lg border border-gray-300 bg-white p-3 shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          minWidth: `${Math.min(position.width, 200)}px`,
          maxWidth: "400px",
        }}
      >
        <div className="mb-1 text-sm text-gray-600">Valor capturado:</div>
        <div className="max-h-20 overflow-y-auto rounded border bg-gray-50 p-2 text-sm">
          {inputValue || (
            <span className="text-gray-400 italic">Sin contenido</span>
          )}
        </div>
      </div>
    );
  },
);
