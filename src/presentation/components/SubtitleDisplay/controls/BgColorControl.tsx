import { TooltipTriggerAsChild } from "~@/presentation/components/ui/own/tooltip-trigger-aschild";

interface BgColorControlProps {
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

export const BgColorControl = ({ bgColor, onBgColorChange }: BgColorControlProps) => (
  <TooltipTriggerAsChild tooltipText="Color de fondo">
    <input
      type="color"
      value={bgColor}
      onChange={(e) => onBgColorChange(e.target.value)}
      className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0.5"
    />
  </TooltipTriggerAsChild>
);
