import { cn } from "~@/presentation/lib/utils";

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SubtitleLineProps {
  text: string;
  /** Opacity from 0 to 1. Older lines have lower opacity for a fade effect. */
  opacity: number;
  /** Override font size in px. Defaults to text-4xl (36px). */
  fontSize?: number;
  /** Override font color. Defaults to white. */
  color?: string;
  /** Override background color. Always rendered at 80% opacity. Defaults to black. */
  bgColor?: string;
}

/**
 * Renders a single subtitle line with variable opacity.
 * Older lines in the history receive lower opacity values.
 */
export const SubtitleLine = ({
  text,
  opacity,
  fontSize,
  color,
  bgColor,
}: SubtitleLineProps) => (
  <p
    className={cn(
      "m-0 px-6 py-1 leading-tight font-bold drop-shadow-lg",
      "rounded-lg",
      !bgColor && "bg-black/80",
      !fontSize && "text-4xl",
      !color && "text-white",
    )}
    style={{
      opacity,
      transition: "opacity 0.3s ease",
      ...(bgColor && { backgroundColor: hexToRgba(bgColor, 0.8) }),
      ...(fontSize && { fontSize: `${fontSize}px` }),
      ...(color && { color }),
    }}
  >
    {text}
  </p>
);
