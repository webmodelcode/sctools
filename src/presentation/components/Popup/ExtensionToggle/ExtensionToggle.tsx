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

interface ExtensionToggleProps {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
}

export const ExtensionToggle = ({
  isEnabled,
  onToggle,
}: ExtensionToggleProps) => {
  return (
    <div className="mx-4 flex items-center justify-end gap-4">
      <Label className="text-sm">{EXTENSION_TOGGLE.LABEL}</Label>
      <Switch checked={isEnabled} onCheckedChange={onToggle} />
    </div>
  );
};
