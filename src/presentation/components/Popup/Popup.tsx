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
import EW_LOGO from "~@/presentation/assets/ew-logo.svg";

import "~@/presentation/assets/globals.css";

export const Popup = memo(() => {
  return (
    <Card className="relative flex h-140 min-w-md flex-col gap-2 overflow-hidden rounded-none! bg-brand-bg! text-foreground">
      <img
        src={EW_LOGO}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-3/4 left-[6%] w-140 -translate-x-1/2 -translate-y-1/2 opacity-10 select-none"
      />
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
