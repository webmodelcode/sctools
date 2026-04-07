import { Mic } from "lucide-react";

/**
 * Visual-only loading indicator shown while a translation stream is in progress.
 * Designed to occupy the same vertical space as a SubtitleLine so the layout
 * remains stable when it appears and disappears.
 */
export const SubtitleLoadingIndicator = () => (
  <div className="flex w-full items-center justify-end px-6">
    <Mic className="h-10 w-10 animate-pulse rounded-md bg-white/60 p-2" />
  </div>
);
