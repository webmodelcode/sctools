import { forwardRef } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";

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

    browser.runtime.sendMessage(
      {
        type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.INPUT_MESSAGE,
        data: inputValue,
      },
      (data: string) => {
        setTranslatedValue(data);
      },
    );

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
        <div className="mb-1 text-sm text-gray-600">Traducción:</div>
        <div className="flex gap-2">
          <div className="max-h-20 overflow-y-auto rounded border bg-gray-50 p-2 text-sm">
            {translatedValue || (
              <span className="text-gray-400 italic">Sin contenido</span>
            )}
          </div>
          <Button variant={"outline"}>
            <SendHorizontal />
          </Button>
        </div>
      </div>
    );
  },
);
