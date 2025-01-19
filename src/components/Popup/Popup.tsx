import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Hammer } from "lucide-react"

import { useStorage } from "@plasmohq/storage/hook"

/**
 * Main popup component for the extension
 */
export const Popup = () => {
  const [isExtEnabled, setIsExtEnabled] = useStorage("sct-isEnabled", (v) =>
    v === undefined ? false : v
  )

  // Handle extension toggle
  const handleToggleExtension = async (checked: boolean) => {
    // Here we'll add the logic to enable/disable the extension
    setIsExtEnabled(checked)

    console.log("Extension toggled:", checked)
  }

  // Handle donation click
  const handleDonationClick = () => {
    chrome.tabs.create({ url: "https://buymeacoffee.com/juanleon" })
  }

  return (
    <Card className="sct-w-[300px] sct-min-h-[200px] sct-bg-gray-50 sct-rounded-none">
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

          {/* Donation Button */}
          <Button
            variant="outline"
            onClick={handleDonationClick}
            className="sct-w-full">
            Buy me a coffee ☕
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
