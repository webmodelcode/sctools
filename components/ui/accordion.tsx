import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("sct-border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="sct-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "sct-flex sct-flex-1 sct-items-center sct-justify-between sct-py-4 sct-text-sm sct-font-medium sct-transition-all hover:sct-underline sct-text-left [&[data-state=open]>svg]:sct-rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="sct-h-4 sct-w-4 sct-shrink-0 sct-text-muted-foreground sct-transition-transform sct-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="sct-overflow-hidden sct-text-sm data-[state=closed]:sct-animate-accordion-up data-[state=open]:sct-animate-accordion-down"
    {...props}
  >
    <div className={cn("sct-pb-4 sct-pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
