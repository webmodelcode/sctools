import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "sct-inline-flex sct-items-center sct-justify-center sct-gap-2 sct-whitespace-nowrap sct-rounded-md sct-text-sm sct-font-medium sct-transition-colors focus-visible:sct-outline-none focus-visible:sct-ring-1 focus-visible:sct-ring-ring disabled:sct-pointer-events-none disabled:sct-opacity-50 [&_svg]:sct-pointer-events-none [&_svg]:sct-size-4 [&_svg]:sct-shrink-0",
  {
    variants: {
      variant: {
        default:
          "sct-bg-primary sct-text-primary-foreground sct-shadow hover:sct-bg-primary/90",
        destructive:
          "sct-bg-destructive sct-text-destructive-foreground sct-shadow-sm hover:sct-bg-destructive/90",
        outline:
          "sct-border sct-border-input sct-bg-background sct-shadow-sm hover:sct-bg-accent hover:sct-text-accent-foreground",
        secondary:
          "sct-bg-secondary sct-text-secondary-foreground sct-shadow-sm hover:sct-bg-secondary/80",
        ghost: "hover:sct-bg-accent hover:sct-text-accent-foreground",
        link: "sct-text-primary sct-underline-offset-4 hover:sct-underline",
      },
      size: {
        default: "sct-h-9 sct-px-4 sct-py-2",
        sm: "sct-h-8 sct-rounded-md sct-px-3 sct-text-xs",
        lg: "sct-h-10 sct-rounded-md sct-px-8",
        icon: "sct-h-9 sct-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
