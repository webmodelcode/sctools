import { cn } from "~@/presentation/lib/utils";

interface SubtitleLineProps {
  text: string;
  /** Opacity from 0 to 1. Older lines have lower opacity for a fade effect. */
  opacity: number;
  /** Override font size in px. Defaults to text-4xl (36px). */
  fontSize?: number;
  /** Override font color. Defaults to white. */
  color?: string;
}

/**
 * Renders a single subtitle line with variable opacity.
 * Older lines in the history receive lower opacity values.
 */
export const SubtitleLine = ({ text, opacity, fontSize, color }: SubtitleLineProps) => (
  <p
    className={cn(
      "m-0 px-6 py-1 leading-tight font-bold drop-shadow-lg",
      !fontSize && "text-4xl",
      !color && "text-white",
    )}
    style={{
      opacity,
      transition: "opacity 0.3s ease",
      ...(fontSize && { fontSize: `${fontSize}px` }),
      ...(color && { color }),
    }}
  >
    {text}
  </p>
);
