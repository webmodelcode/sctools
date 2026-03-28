import { forwardRef, useState, useEffect } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { selectTextInContentEditable } from "~@/config/utils/selectTextInContentEditable";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";
import { Kbd, KbdGroup } from "~@/presentation/components/ui/kbd";

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
      const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (event.ctrlKey && (key === "q" || key === "e")) {
          event.preventDefault();
          const target = event.target as HTMLInputElement;
          target.select ? target.select() : selectTextInContentEditable(target);
          insertTranslate();
        }
      };

      document.addEventListener("keydown", handleKeyDown, true);

      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
      };
    }, [translatedValue]);

    return (
      <div
        ref={ref}
        className="fixed z-999999 flex max-w-sm flex-col items-start rounded-lg border border-ew-star-color bg-white px-3 py-1 shadow-lg"
        style={{
          top: `${position.top - 40}px`,
          left: `${position.left}px`,
          minWidth: `${Math.min(position.width, 200)}px`,
          maxWidth: "400px",
        }}
      >
        <div className="mb-1 flex w-full flex-col flex-wrap items-center justify-center gap-1 text-sm text-gray-600">
          <span>Para Traducir</span>
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>ctrl</Kbd>+<Kbd>q</Kbd>
            </KbdGroup>
            <span>ó</span>
            <KbdGroup>
              <Kbd>ctrl</Kbd>+<Kbd>e</Kbd>
            </KbdGroup>
          </div>
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
  },
);
