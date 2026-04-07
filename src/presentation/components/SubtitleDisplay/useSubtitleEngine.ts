import { useCallback } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useTranslatorInstance } from "./hooks/useTranslatorInstance";
import { useTranslationStream } from "./hooks/useTranslationStream";
import { useSegmentedRecognition } from "./hooks/useSegmentedRecognition";

const SOURCE_LANGUAGE =
  GLOBAL_STRINGS.SPEECH_TO_TRANSLATE_CONFIG.SOURCE_LANGUAGE;

export interface SubtitleEngineResult {
  /** Committed translated lines (history) */
  lines: string[];
  /** True while a speech or translation stream is in progress */
  isTranslating: boolean;
  /** Non-null when a recoverable error has occurred */
  error: string | null;
  /** Explicitly stop recognition (e.g. user toggled feature off) */
  stop: () => void;
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
  const { translatorRef, error: translatorError } = useTranslatorInstance(
    SOURCE_LANGUAGE,
    targetLanguage,
  );

  const { lines, isTranslating, setIsTranslating, handleTranscript } =
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

  return {
    lines,
    isTranslating,
    error: translatorError ?? recognitionError,
    stop,
  };
};
