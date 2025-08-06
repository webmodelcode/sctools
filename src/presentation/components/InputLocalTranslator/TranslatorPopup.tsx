import { forwardRef, useState, useEffect } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";

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
    const [translatedValue, setTranslatedValue] = useState<string>("");
    const [targetLanguage, setTargetLanguage] = useState<string>("");
    const { getItem, watchItem } = useLocalTranslatorTargetLanguage();

    useEffect(() => {
      getItem().then((value) => {
        setTargetLanguage(value);
      });
    }, []);

    watchItem((value) => {
      setTargetLanguage(value);
    });

    const insertTranslate = () => {
      document.execCommand("insertText", false, translatedValue);
    };

    browser.runtime.sendMessage(
      {
        type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.INPUT_MESSAGE,
        data: inputValue,
        target: targetLanguage,
      },
      (data: string) => {
        setTranslatedValue(data);
      },
    );

    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key.toLowerCase() === "q") {
          event.preventDefault();
          (event.target as HTMLInputElement)?.select();
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
          minWidth: `${Math.min(position.width, 200)}px`,
          maxWidth: "400px",
        }}
      >
        <div className="mb-1 w-full text-sm text-gray-600">
          <span className="font-bold">ctrl + q</span> para traducir
        </div>

        <div className="max-h-14 w-full overflow-y-auto rounded border bg-gray-50 px-2 text-center text-sm">
          {translatedValue || (
            <span className="text-gray-400 italic">Sin contenido</span>
          )}
        </div>
      </div>
    );
  },
);
