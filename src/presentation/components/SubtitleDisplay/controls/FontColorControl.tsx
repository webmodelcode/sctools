import { TooltipTriggerAsChild } from "~@/presentation/components/ui/own/tooltip-trigger-aschild";

interface FontColorControlProps {
  fontColor: string;
  onFontColorChange: (color: string) => void;
}

export const FontColorControl = ({ fontColor, onFontColorChange }: FontColorControlProps) => (
  <TooltipTriggerAsChild tooltipText="Color de fuente">
    <input
      type="color"
      value={fontColor}
      onChange={(e) => onFontColorChange(e.target.value)}
      className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0.5"
    />
  </TooltipTriggerAsChild>
);
