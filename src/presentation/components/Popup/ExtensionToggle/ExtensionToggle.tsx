/**
 * ExtensionToggle Component
 *
 * Toggle switch component for enabling/disabling the extension.
 *
 * @module components/Popup/ExtensionToggle
 * @returns {JSX.Element} - Returns the JSX element representing the extension toggle.
 */

import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { EXTENSION_TOGGLE } from "./ExtensionToggle.strings.json";
import { cn } from "~@/presentation/lib/utils";
import { TooltipTriggerAsChild } from "../../ui/own/tooltip-trigger-aschild";

interface ExtensionToggleProps {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  orientation?: "vertical" | "horizontal";
  featureName?: string;
  tooltipText?: string;
}

export const ExtensionToggle = ({
  isEnabled,
  onToggle,
  orientation = "vertical",
  featureName,
  tooltipText,
}: ExtensionToggleProps) => {
  return (
    <TooltipTriggerAsChild tooltipText={tooltipText}>
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          orientation === "vertical" ? "flex-col" : "flex-row",
        )}
      >
        <Label className="block min-w-24 text-sm">
          <span className="mr-2">{featureName}</span>
        </Label>
        <div className="flex items-center gap-2">
          <Switch checked={isEnabled} onCheckedChange={onToggle} />
          <Label className="block min-w-24 text-center text-sm">
            {isEnabled ? EXTENSION_TOGGLE.LABEL_ON : EXTENSION_TOGGLE.LABEL_OFF}
          </Label>
        </div>
      </div>
    </TooltipTriggerAsChild>
  );
};
