import { useCallback } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useTranslatorInstance, type TranslatorError } from "./hooks/useTranslatorInstance";
import { useTranslationStream } from "./hooks/useTranslationStream";
import { useSegmentedRecognition } from "./hooks/useSegmentedRecognition";

const SOURCE_LANGUAGE =
  GLOBAL_STRINGS.SPEECH_TO_TRANSLATE_CONFIG.SOURCE_LANGUAGE;

export interface SubtitleEngineResult {
  /** Committed translated lines (history) */
  lines: string[];
  /** True while a speech or translation stream is in progress */
  isTranslating: boolean;
  /** Non-null when a non-recoverable error has occurred (display string) */
  error: string | null;
  /** Structured translator error — check kind for recoverable cases */
  translatorError: TranslatorError | null;
  /** Retry translator creation within a user gesture context */
  retry: (onProgress?: (loaded: number) => void) => Promise<void>;
  /** Explicitly stop recognition (e.g. user toggled feature off) */
  stop: () => void;
  /** Clear all accumulated subtitle lines */
  clearLines: () => void;
}

/**
 * Orchestrator hook for the subtitle display.
 *
 * Wires together three focused sub-hooks:
 * - `useTranslatorInstance` — Translator API lifecycle
 * - `useTranslationStream`  — streaming translation pipeline + line history
 * - `useSegmentedRecognition` — speech recognition with time-based segmentation
 *
 * @param targetLanguage BCP-47 language code for the translation target (e.g. "en", "fr").
 */
export const useSubtitleEngine = (
  targetLanguage: string,
): SubtitleEngineResult => {
  const { translatorRef, error: translatorError, retry } = useTranslatorInstance(
    SOURCE_LANGUAGE,
    targetLanguage,
  );

  const { lines, isTranslating, setIsTranslating, handleTranscript, clearLines } =
    useTranslationStream(translatorRef);

  const onSpeechStart = useCallback(
    () => setIsTranslating(true),
    [setIsTranslating],
  );

  const { error: recognitionError, stop } = useSegmentedRecognition({
    lang: SOURCE_LANGUAGE,
    onSpeechStart,
    onResult: handleTranscript,
  });

  // "user-gesture-required" is handled by TranslatorDownloadPrompt — don't surface as a display error
  const displayError =
    translatorError?.kind === "user-gesture-required"
      ? recognitionError
      : (translatorError?.message ?? recognitionError);

  return {
    lines,
    isTranslating,
    error: displayError,
    translatorError,
    retry,
    stop,
    clearLines,
  };
};
