import { Input } from "~@/presentation/components/ui/input";
import { TooltipTriggerAsChild } from "~@/presentation/components/ui/own/tooltip-trigger-aschild";

interface FontSizeControlProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const FontSizeControl = ({ fontSize, onFontSizeChange }: FontSizeControlProps) => (
  <TooltipTriggerAsChild tooltipText="Tamaño de fuente (16–72px)">
    <Input
      type="number"
      min={16}
      max={72}
      step={2}
      value={fontSize}
      onChange={(e) => {
        const value = Math.min(72, Math.max(16, Number(e.target.value)));
        onFontSizeChange(value);
      }}
      className="h-7 w-16 text-xs"
    />
  </TooltipTriggerAsChild>
);
