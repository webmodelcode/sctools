/**
 * Popup Component
 *
 * The `Popup` component is the main interface for the extension's popup.
 * It provides a switch to enable/disable the extension and quick message operations.
 * This component has been refactored to be modular and maintainable.
 *
 * @module components/Popup
 * @returns {JSX.Element} - Returns the JSX element representing the popup.
 */

import { memo } from "react";
import { Card } from "../ui/card";
import { PopupHeader } from "./PopupHeader/PopupHeader";
import { PopupContent } from "./PopupContent/PopupContent";
import { useExtensionState } from "~@/presentation/hooks/useExtensionState/useExtensionState";

import "~@/presentation/assets/globals.css";

export const Popup = memo(() => {
  const { isQuickMenuEnabled, handleToggleExtension } = useExtensionState();

  return (
    <Card className="min-h-[200px] min-w-[350px] !rounded-none !bg-ew-star-color text-white">
      <PopupHeader />
      <PopupContent
        isQuickMenuEnabled={isQuickMenuEnabled}
        onToggleExtension={handleToggleExtension}
      />
    </Card>
  );
});
