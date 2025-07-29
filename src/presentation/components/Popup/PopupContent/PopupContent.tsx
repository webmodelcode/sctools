/**
 * PopupContent Component
 *
 * Main content section of the popup containing the extension toggle and quick message operations.
 *
 * @module components/Popup/PopupContent
 * @returns {JSX.Element} - Returns the JSX element representing the popup content.
 */

import { CardContent } from "../../ui/card";
import { ExtensionToggle } from "../ExtensionToggle/ExtensionToggle";
import { QuickMessageOperations } from "../QuickMessageOperations/QuickMessageOperations";

interface PopupContentProps {
  isQuickMenuEnabled: boolean;
  onToggleExtension: (checked: boolean) => void;
}

export const PopupContent = ({
  isQuickMenuEnabled,
  onToggleExtension,
}: PopupContentProps) => {
  return (
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-4 rounded-lg border p-3 shadow-sm">
        <ExtensionToggle
          isEnabled={isQuickMenuEnabled}
          onToggle={onToggleExtension}
        />
        <QuickMessageOperations />
      </div>
    </CardContent>
  );
};