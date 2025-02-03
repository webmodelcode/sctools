import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "sct-relative sct-w-full sct-rounded-lg sct-border sct-px-4 sct-py-3 sct-text-sm [&>svg+div]:sct-translate-y-[-3px] [&>svg]:sct-absolute [&>svg]:sct-left-4 [&>svg]:sct-top-4 [&>svg]:sct-text-foreground [&>svg~*]:sct-pl-7",
  {
    variants: {
      variant: {
        default: "sct-bg-background sct-text-foreground",
        destructive:
          "sct-border-destructive/50 sct-text-destructive dark:sct-border-destructive [&>svg]:sct-text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("sct-mb-1 sct-font-medium sct-leading-none sct-tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sct-text-sm [&_p]:sct-leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
