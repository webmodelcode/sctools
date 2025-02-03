import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "sct-relative sct-z-10 sct-flex sct-max-w-max sct-flex-1 sct-items-center sct-justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "sct-group sct-flex sct-flex-1 sct-list-none sct-items-center sct-justify-center sct-space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "sct-group sct-inline-flex sct-h-9 sct-w-max sct-items-center sct-justify-center sct-rounded-md sct-bg-background sct-px-4 sct-py-2 sct-text-sm sct-font-medium sct-transition-colors hover:sct-bg-accent hover:sct-text-accent-foreground focus:sct-bg-accent focus:sct-text-accent-foreground focus:sct-outline-none disabled:sct-pointer-events-none disabled:sct-opacity-50 data-[active]:sct-bg-accent/50 data-[state=open]:sct-bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "sct-group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="sct-relative sct-top-[1px] sct-ml-1 sct-h-3 sct-w-3 sct-transition sct-duration-300 group-data-[state=open]:sct-rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "sct-left-0 sct-top-0 sct-w-full data-[motion^=from-]:sct-animate-in data-[motion^=to-]:sct-animate-out data-[motion^=from-]:sct-fade-in data-[motion^=to-]:sct-fade-out data-[motion=from-end]:sct-slide-in-from-right-52 data-[motion=from-start]:sct-slide-in-from-left-52 data-[motion=to-end]:sct-slide-out-to-right-52 data-[motion=to-start]:sct-slide-out-to-left-52 md:sct-absolute md:sct-w-auto sct-",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("sct-absolute sct-left-0 sct-top-full sct-flex sct-justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "sct-origin-top-center sct-relative sct-mt-1.5 sct-h-[var(--radix-navigation-menu-viewport-height)] sct-w-full sct-overflow-hidden sct-rounded-md sct-border sct-bg-popover sct-text-popover-foreground sct-shadow data-[state=open]:sct-animate-in data-[state=closed]:sct-animate-out data-[state=closed]:sct-zoom-out-95 data-[state=open]:sct-zoom-in-90 md:sct-w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "sct-top-full sct-z-[1] sct-flex sct-h-1.5 sct-items-end sct-justify-center sct-overflow-hidden data-[state=visible]:sct-animate-in data-[state=hidden]:sct-animate-out data-[state=hidden]:sct-fade-out data-[state=visible]:sct-fade-in",
      className
    )}
    {...props}
  >
    <div className="sct-relative sct-top-[60%] sct-h-2 sct-w-2 sct-rotate-45 sct-rounded-tl-sm sct-bg-border sct-shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
