import { useCallback, useRef, useState } from "react";

const MAX_HISTORY_LINES = 8;

export interface UseTranslationStreamResult {
  lines: string[];
  isTranslating: boolean;
  setIsTranslating: (value: boolean) => void;
  handleTranscript: (transcript: string, isFinal: boolean) => Promise<void>;
}

/**
 * Manages the streaming translation pipeline and committed subtitle lines.
 *
 * - Receives final transcripts from speech recognition.
 * - Translates them via `Translator.translateStreaming()`.
 * - Accumulates translated lines in a bounded history.
 */
export const useTranslationStream = (
  translatorRef: React.RefObject<Translator | null>,
): UseTranslationStreamResult => {
  const [lines, setLines] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const streamReaderRef = useRef<ReadableStreamDefaultReader<string> | null>(
    null,
  );

  const handleTranscript = useCallback(
    async (transcript: string, isFinal: boolean) => {
      if (!isFinal || !translatorRef.current) return;

      // Cancel any in-flight stream (safety net for overlapping final results).
      if (streamReaderRef.current) {
        await streamReaderRef.current.cancel();
        streamReaderRef.current = null;
      }

      const stream = translatorRef.current.translateStreaming(transcript);
      const reader = stream.getReader();
      streamReaderRef.current = reader;

      let latestChunk = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // Each chunk is the accumulated partial translation (not a delta).
          latestChunk = value;
        }

        if (latestChunk) {
          setLines((prev) => [
            ...prev.slice(-(MAX_HISTORY_LINES - 1)),
            latestChunk,
          ]);
        }
      } catch {
        // Stream was cancelled — do nothing.
      } finally {
        setIsTranslating(false);
      }
    },
    [translatorRef],
  );

  return { lines, isTranslating, setIsTranslating, handleTranscript };
};
