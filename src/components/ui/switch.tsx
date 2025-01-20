import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "sct-peer sct-inline-flex sct-h-5 sct-w-9 sct-shrink-0 sct-cursor-pointer sct-items-center sct-rounded-full sct-border-2 sct-border-transparent sct-shadow-sm sct-transition-colors focus-visible:sct-outline-none focus-visible:sct-ring-2 focus-visible:sct-ring-ring focus-visible:sct-ring-offset-2 focus-visible:sct-ring-offset-background disabled:sct-cursor-not-allowed disabled:sct-opacity-50 data-[state=checked]:sct-bg-primary data-[state=unchecked]:sct-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "sct-pointer-events-none sct-block sct-h-4 sct-w-4 sct-rounded-full sct-bg-background sct-shadow-lg sct-ring-0 sct-transition-transform data-[state=checked]:sct-translate-x-4 data-[state=unchecked]:sct-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
