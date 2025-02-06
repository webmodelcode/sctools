/**
 * Popup Component
 *
 * The `Popup` component is the main interface for the extension's popup.
 * It provides a switch to enable/disable the extension and a button to support the project via donations.
 *
 * @module components/Popup
 * @returns {JSX.Element} - Returns the JSX element representing the popup.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks";
import { Hammer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GLOBAL_STINGS } from "@/config";
import { QuickMessageOptions } from "..";
import { Label } from "../ui/label";

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

  const handleDonationClick = () => {
    if (!chrome.tabs) {
      window.open(GLOBAL_STINGS.DONATION_URL, "_blank", "noopener");
      return;
    }
    chrome.tabs.create({ url: GLOBAL_STINGS.DONATION_URL });
  };

  return (
    <Card className="sct-w-[450px] sct-min-h-[200px] sct-bg-gray-50 sct-rounded-none">
      <CardHeader className="sct-flex sct-flex-row sct-items-center sct-justify-around sct-space-y-0 sct-p-3">
        <CardTitle className="sct-text-2xl sct-font-bold">
          <Hammer className="sct-inline-block sct-h-6 sct-w-6 sct-text-gray-500 sct-cursor-pointer hover:sct-text-gray-700 sct-mr-2" />
          <span>ScTools</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="sct-p-4  ">
        <div className="sct-flex sct-flex-col sct-items-center sct-justify-between sct-bg-white sct-rounded-lg sct-p-3 sct-shadow-sm sct-gap-4">
          {/* Extension Toggle */}
          <div className="sct-flex sct-items-center sct-justify-between">
            <span className="sct-font-medium sct-text-sm  sct-text-gray-700 sct-p-2">
              Enable Extension
            </span>
            <Switch
              className="sct-data-[state=checked]:sct-bg-blue-600"
              checked={isExtEnabled}
              onCheckedChange={handleToggleExtension}
            />
          </div>

          <Label className="sct-text-xl"> Quick Message Operations </Label>
          <div className="sct-flex sct-flex-row">
            {quickMessageOptions.map((opt) => (
              <QuickMessageOptions label={opt} key={opt} />
            ))}
          </div>

          {/* Donation Button */}
          <Button
            variant="outline"
            onClick={handleDonationClick}
            className="sct-w-full"
          >
            Buy me a coffee ☕
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
