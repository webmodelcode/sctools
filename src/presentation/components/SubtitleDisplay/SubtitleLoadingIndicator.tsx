/**
 * Visual-only loading indicator shown while a translation stream is in progress.
 * Designed to occupy the same vertical space as a SubtitleLine so the layout
 * remains stable when it appears and disappears.
 */
export const SubtitleLoadingIndicator = () => (
  <div className="flex w-full items-center gap-3 px-6 py-1">
    <div className="h-10 flex-1 animate-pulse rounded-md bg-white/10" />
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
  </div>
);
