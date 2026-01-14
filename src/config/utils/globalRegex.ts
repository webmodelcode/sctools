/**
 * Global Regular Expressions for common validation and parsing tasks
 * 
 * @module config/utils/globalRegex
 */

/**
 * Regex to detect all types of problematic quotes that can cause errors when parsing JSON
 * 
 * Detects:
 * - Curly double quotes (U+201C, U+201D)
 * - Curly single quotes (U+2018, U+2019)
 * - Backticks (U+0060)
 * - Straight single quotes (U+0027)
 * 
 * @example
 * const text = 'This has curly quotes and single curly and backticks';
 * const matches = text.match(PROBLEMATIC_QUOTES_REGEX);
 * // Will detect all problematic quotes
 */
export const PROBLEMATIC_QUOTES_REGEX = /[\u201C\u201D\u2018\u2019\u0060\u0027]/g;