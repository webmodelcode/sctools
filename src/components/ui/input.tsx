import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "sct-flex sct-h-9 sct-w-full sct-rounded-md sct-border sct-border-input sct-bg-transparent sct-px-3 sct-py-1 sct-text-base sct-shadow-sm sct-transition-colors file:sct-border-0 file:sct-bg-transparent file:sct-text-sm file:sct-font-medium file:sct-text-foreground placeholder:sct-text-muted-foreground focus-visible:sct-outline-none focus-visible:sct-ring-1 focus-visible:sct-ring-ring disabled:sct-cursor-not-allowed disabled:sct-opacity-50 md:sct-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
