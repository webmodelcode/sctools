import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "sct-fixed sct-inset-0 sct-z-50 sct-bg-black/80 sct- data-[state=open]:sct-animate-in data-[state=closed]:sct-animate-out data-[state=closed]:sct-fade-out-0 data-[state=open]:sct-fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "sct-fixed sct-left-[50%] sct-top-[50%] sct-z-50 sct-grid sct-w-full sct-max-w-lg sct-translate-x-[-50%] sct-translate-y-[-50%] sct-gap-4 sct-border sct-bg-background sct-p-6 sct-shadow-lg sct-duration-200 data-[state=open]:sct-animate-in data-[state=closed]:sct-animate-out data-[state=closed]:sct-fade-out-0 data-[state=open]:sct-fade-in-0 data-[state=closed]:sct-zoom-out-95 data-[state=open]:sct-zoom-in-95 data-[state=closed]:sct-slide-out-to-left-1/2 data-[state=closed]:sct-slide-out-to-top-[48%] data-[state=open]:sct-slide-in-from-left-1/2 data-[state=open]:sct-slide-in-from-top-[48%] sm:sct-rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="sct-absolute sct-right-4 sct-top-4 sct-rounded-sm sct-opacity-70 sct-ring-offset-background sct-transition-opacity hover:sct-opacity-100 focus:sct-outline-none focus:sct-ring-2 focus:sct-ring-ring focus:sct-ring-offset-2 disabled:sct-pointer-events-none data-[state=open]:sct-bg-accent data-[state=open]:sct-text-muted-foreground">
        <X className="sct-h-4 sct-w-4" />
        <span className="sct-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sct-flex sct-flex-col sct-space-y-1.5 sct-text-center sm:sct-text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sct-flex sct-flex-col-reverse sm:sct-flex-row sm:sct-justify-end sm:sct-space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "sct-text-lg sct-font-semibold sct-leading-none sct-tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("sct-text-sm sct-text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
