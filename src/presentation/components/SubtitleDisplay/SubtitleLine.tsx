interface SubtitleLineProps {
  text: string;
  /** Opacity from 0 to 1. Older lines have lower opacity for a fade effect. */
  opacity: number;
}

/**
 * Renders a single subtitle line with variable opacity.
 * Older lines in the history receive lower opacity values.
 */
export const SubtitleLine = ({ text, opacity }: SubtitleLineProps) => (
  <p
    className="m-0 px-6 py-1 text-4xl leading-tight font-bold text-white drop-shadow-lg"
    style={{ opacity, transition: "opacity 0.3s ease" }}
  >
    {text}
  </p>
);
