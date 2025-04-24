/**
 * Popup Component
 *
 * The `Popup` component is the main interface for the extension's popup.
 * It provides a switch to enable/disable the extension and a button to support the project via donations.
 *
 * @module components/Popup
 * @returns {JSX.Element} - Returns the JSX element representing the popup.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks";
import { Hammer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GLOBAL_STINGS } from "@/config";
import { QuickMessageOptions } from "..";
import { Label } from "../ui/label";
import { EwLogo } from "../EwLogo/EwLogo";

const EXT_ISACTIVE_LOCAL_STORAGE_KEY =
  GLOBAL_STINGS.EXT_ISACTIVE_LOCAL_STORAGE_KEY;

const quickMessageOptions: ("add" | "update" | "delete")[] = [
  "add",
  "update",
  "delete",
];

export const Popup = () => {
  const localStorage = useLocalStorage();
  const [isExtEnabled, setIsExtEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initExtensionState = useCallback(async () => {
    if (isInitialized) return;

    const storedState = await localStorage.getItem(
      EXT_ISACTIVE_LOCAL_STORAGE_KEY
    );
    setIsExtEnabled(storedState === "true");
    setIsInitialized(true);
  }, [localStorage, isInitialized]);

  useEffect(() => {
    initExtensionState();
  }, [initExtensionState]);

  const handleToggleExtension = async (checked: boolean) => {
    localStorage.setItem(EXT_ISACTIVE_LOCAL_STORAGE_KEY, checked.toString());
    setIsExtEnabled(checked);

    if (!chrome.tabs) {
      location.reload();
      return;
    }

    chrome.tabs.reload();
  };

  return (
    <Card className="sct-min-w-[350px]  sct-min-h-[200px] sct-text-white !sct-rounded-none !sct-bg-[#F9AE28]">
      <CardHeader className="sct-flex sct-flex-row sct-items-center sct-justify-around sct-space-y-0 sct-p-3">
        <CardTitle className="sct-text-2xl sct-font-bold">
          <EwLogo className="sct-h-32 sct-mx-auto" />
          <span>ScTools</span>
          <span className="sct-pl-2 sct-text-sm">by Estrellas Webcam</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="sct-p-4">
        <div className="sct-flex sct-items-start sct-justify-between  sct-rounded-lg sct-p-3 sct-shadow-sm sct-gap-4 sct-border">
          {/* Extension Toggle */}
          <div className="sct-flex sct-flex-col sct-items-center sct-justify-start">
            <Label className="sct-text-sm sct-pb-4">Enable Extension</Label>
            <Switch
              className="sct-data-[state=checked]:sct-bg-blue-600"
              checked={isExtEnabled}
              onCheckedChange={handleToggleExtension}
            />
          </div>

          <div>
            <Label className="sct-text-sm"> Quick Message Operations </Label>
            <div className="sct-flex sct-flex-row">
              {quickMessageOptions.map((opt) => (
                <QuickMessageOptions label={opt} key={opt} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
