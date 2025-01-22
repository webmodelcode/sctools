import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "sct-z-50 sct-overflow-hidden sct-rounded-md sct-bg-primary sct-px-3 sct-py-1.5 sct-text-xs sct-text-primary-foreground sct-animate-in sct-fade-in-0 sct-zoom-in-95 data-[state=closed]:sct-animate-out data-[state=closed]:sct-fade-out-0 data-[state=closed]:sct-zoom-out-95 data-[side=bottom]:sct-slide-in-from-top-2 data-[side=left]:sct-slide-in-from-right-2 data-[side=right]:sct-slide-in-from-left-2 data-[side=top]:sct-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
