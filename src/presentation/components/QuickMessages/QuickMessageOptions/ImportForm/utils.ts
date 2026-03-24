/**
 * Utility functions for ImportForm component
 */
import { IQuickMessage } from "~@/infrastructure/datasource/quickMessages.local.datasource";

/**
 * Sanitizes the captured internal content without breaking emojis or special characters.
 */
export const cleanInternalText = (content: string): string => {
  return (
    content
      .trim()
      // Normalizes smart apostrophes (e.g., Don’t -> Don't) to standard single quotes
      .replaceAll(/[\u2018\u2019]/g, "'")
      // Normalizes smart double quotes to standard double quotes
      .replaceAll(/[\u201C\u201D]/g, '"')
  );
};

/**
 * Normalizes a malformed JSON string by segmenting it into individual objects.
 * It identifies label/text pairs regardless of the type of quotes used.
 */
export const normalizeJsonEntries = (input: string): IQuickMessage[] => {
  // Regex pattern to capture content between any quote-like delimiters for label and text
  // The 's' flag allows the dot (.) to match newlines within the text
  const entryPattern =
    /\{[\s\n]*["'“‘´’]label["'”’´]\s*:\s*["'“‘´’](.*?)["'”’´]\s*,\s*["'“‘´’]text["'”’´]\s*:\s*["'“‘´’](.*?)["'”’´][\s\n]*\}/gs;

  const results: IQuickMessage[] = [];
  let match: RegExpExecArray | null;

  while ((match = entryPattern.exec(input)) !== null) {
    // match[1] corresponds to label content, match[2] to text content
    const [_, rawLabel, rawText] = match;

    results.push({
      label: cleanInternalText(rawLabel),
      text: cleanInternalText(rawText),
    });
  }

  return results;
};
