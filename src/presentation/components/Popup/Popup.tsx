/**
 * Popup Component
 *
 * The `Popup` component is the main interface for the extension's popup.
 * It provides a switch to enable/disable the extension and quick message operations.
 *
 * @module components/Popup
 * @returns {JSX.Element} - Returns the JSX element representing the popup.
 */

import { memo, useCallback, useEffect, useState } from "react";
import { QuickMessageOptions } from "../QuickMessages/QuickMessageOptions/QuickMessageOptions";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useLocalStorage/useQuickMenuIsActive";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { EwLogo } from "../EwLogo/EwLogo";
import { Label } from "../ui/label";

import "~@/presentation/assets/globals.css";

const quickMessageOptions: readonly ("add" | "update" | "delete")[] = [
  "add",
  "update",
  "delete",
] as const;

export const Popup = memo(() => {
  const quickMenuIsActive = useQuickMenuIsActive();
  const [isQuickMenuEnabled, setIsQuickMenuEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initExtensionState = useCallback(async () => {
    if (isInitialized) return;

    const storedState = await quickMenuIsActive.getItem();
    setIsQuickMenuEnabled(storedState);
    setIsInitialized(true);
  }, [isInitialized]);

  useEffect(() => {
    initExtensionState();
  }, [initExtensionState]);

  const handleToggleExtension = async (checked: boolean) => {
    quickMenuIsActive.setItem(checked);
    setIsQuickMenuEnabled(checked);

    if (typeof browser !== "undefined" && browser.tabs) {
      browser.tabs.reload();
    }
  };

  return (
    <Card className="min-h-[200px] min-w-[350px] !rounded-none !bg-[#F9AE28] text-white">
      <CardHeader className="flex flex-row items-center justify-around space-y-0 p-3">
        <CardTitle className="text-2xl font-bold">
          <EwLogo className="mx-auto h-32" />
          <span>ScTools</span>
          <span className="pl-2 text-sm">by Estrellas Webcam</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 rounded-lg border p-3 shadow-sm">
          {/* Extension Toggle */}
          <div className="flex flex-col items-center justify-start">
            <Label className="pb-4 text-sm">Enable Extension</Label>
            <Switch
              checked={isQuickMenuEnabled}
              onCheckedChange={handleToggleExtension}
            />
          </div>

          <div>
            <Label className="text-sm"> Quick Message Operations </Label>
            <div className="flex flex-row">
              {quickMessageOptions.map((opt) => (
                <QuickMessageOptions label={opt} key={opt} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
