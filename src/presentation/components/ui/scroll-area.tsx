import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "~@/presentation/lib/utils";

export interface ScrollAreaRef {
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> {
  onScrollStateChange?: (state: {
    canScrollUp: boolean;
    canScrollDown: boolean;
  }) => void;
}

const ScrollArea = React.forwardRef<ScrollAreaRef, ScrollAreaProps>(
  ({ className, children, onScrollStateChange, ...props }, ref) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);

    const checkScrollState = React.useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport || !onScrollStateChange) return;

      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const canScrollUp = scrollTop > 0;
      // We use a small tolerance of 1px to avoid floating point issues
      const canScrollDown =
        Math.ceil(scrollTop + clientHeight) < scrollHeight - 1;

      onScrollStateChange({ canScrollUp, canScrollDown });
    }, [onScrollStateChange]);

    React.useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        viewportRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        // Check state after a small delay to allow scroll to start/finish
        // or rely on onScroll event which will fire
      },
      scrollToBottom: () => {
        const viewport = viewportRef.current;
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        }
      },
    }));

    // Check scroll state when children change or window resizes
    React.useEffect(() => {
      checkScrollState();
      // Also set up a ResizeObserver if supported
      if (!viewportRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        checkScrollState();
      });

      resizeObserver.observe(viewportRef.current);
      // Observe children wrapper if possible, but children are passed directly.
      // We will rely on React updates triggering this effect for children changes if we add children to dep array?
      // No, children prop change might not mean layout changed.

      return () => resizeObserver.disconnect();
    }, [checkScrollState, children]);

    return (
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        className={cn("relative", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
          onScroll={checkScrollState}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
