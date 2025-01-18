import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import React from "react"

/**
 * Main popup component for the extension
 */
export const Popup = () => {
  // Handle extension toggle
  const handleToggleExtension = async (checked: boolean) => {
    // Here we'll add the logic to enable/disable the extension
    console.log("Extension toggled:", checked)
  }

  // Handle donation click
  const handleDonationClick = () => {
    chrome.tabs.create({ url: "https://buymeacoffee.com/juanleon" })
  }

  return (
    <Card className="sct-w-[300px]">
      <CardHeader className="sct-flex sct-flex-row sct-items-center sct-justify-between sct-space-y-0 sct-pb-2">
        <CardTitle className="sct-text-2xl sct-font-bold">ScTools</CardTitle>
        <Settings className="sct-h-6 sct-w-6 sct-text-gray-500 sct-cursor-pointer hover:sct-text-gray-700" />
      </CardHeader>

      <CardContent>
        <div className="sct-flex sct-flex-col sct-gap-4">
          {/* Extension Toggle */}
          <div className="sct-flex sct-items-center sct-justify-between">
            <span className="sct-font-medium">Enable Extension</span>
            <Switch onCheckedChange={handleToggleExtension} />
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
