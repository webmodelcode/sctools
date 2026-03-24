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
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { Label } from "../ui/label";

import "~@/presentation/assets/globals.css";

export const Popup = memo(() => {
  return (
    <Card className="flex min-h-130 min-w-md flex-col gap-2 rounded-none! bg-brand-bg! text-white">
      <div className="mx-4 flex items-center justify-between gap-4">
        <PopupHeader />
        <div className="flex flex-col items-center justify-center gap-2">
          <Label>Traducir a:</Label>
          <LanguageSelector />
        </div>
      </div>
      <PopupContent />
    </Card>
  );
});
