import { ClearHistoryButton } from "./ClearHistoryButton";
import { FontColorControl } from "./FontColorControl";
import { FontSizeControl } from "./FontSizeControl";

interface SubtitleControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontColor: string;
  onFontColorChange: (color: string) => void;
  onClear: () => void;
}

export const SubtitleControls = ({
  fontSize,
  onFontSizeChange,
  fontColor,
  onFontColorChange,
  onClear,
}: SubtitleControlsProps) => (
  <div className="absolute top-1 right-1 z-50 flex items-center gap-1.5 rounded-md bg-black/30 px-2 py-1 opacity-30 transition-opacity hover:opacity-100">
    <FontSizeControl fontSize={fontSize} onFontSizeChange={onFontSizeChange} />
    <FontColorControl
      fontColor={fontColor}
      onFontColorChange={onFontColorChange}
    />
    <ClearHistoryButton onClear={onClear} />
  </div>
);
