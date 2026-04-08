import { useCallback, useEffect, useRef, useState } from "react";
import { localSpeechRecognition } from "~@/infrastructure/datasource/webSpeechRecognition.local.datasource";
import { devConsole } from "~@/config/utils/developerUtils";

const SEGMENT_INTERVAL_MS = 10_000;

interface UseSegmentedRecognitionParams {
  lang: string;
  onSpeechStart: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
}

export interface UseSegmentedRecognitionResult {
  error: string | null;
  /** Explicitly stop recognition (e.g. user toggled feature off) */
  stop: () => void;
}

/**
 * Manages the Web Speech API recognition lifecycle with time-based segmentation.
 *
 * - Runs continuously with auto-restart on silence timeout.
 * - Forces a final result every ~10s via segment timer to keep subtitles stable.
 * - Exposes a `stop()` to explicitly halt recognition.
 */
export const useSegmentedRecognition = ({
  lang,
  onSpeechStart,
  onResult,
}: UseSegmentedRecognitionParams): UseSegmentedRecognitionResult => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const stoppedByUserRef = useRef(false);
  const segmentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = localSpeechRecognition.isAvailable();

  useEffect(() => {
    // Reset on each effect run so auto-restart works after re-mounts (e.g. StrictMode).
    stoppedByUserRef.current = false;

    if (!isAvailable) {
      setError("Web Speech API no disponible en este entorno.");
      return;
    }

    const clearSegmentTimer = () => {
      if (segmentTimerRef.current !== null) {
        clearInterval(segmentTimerRef.current);
        segmentTimerRef.current = null;
      }
    };

    const startSegmentTimer = () => {
      clearSegmentTimer();
      segmentTimerRef.current = setInterval(() => {
        recognitionRef.current?.stop();
      }, SEGMENT_INTERVAL_MS);
    };

    const recognition = localSpeechRecognition.create({
      lang,
      onSpeechStart,
      onResult,
      onEnd: () => {
        // Auto-restart after silence timeout or segment timer unless stopped explicitly.
        if (!stoppedByUserRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            startSegmentTimer();
          } catch (err) {
            devConsole.error((err as Error).message);
          }
        }
      },
      onError: (event) => {
        if (event.error === "not-allowed") {
          setError(
            "Permiso de micrófono denegado. Habilítalo en la configuración del navegador.",
          );
        }
      },
    });

    recognitionRef.current = recognition;
    recognition.start();
    startSegmentTimer();

    return () => {
      stoppedByUserRef.current = true;
      clearSegmentTimer();
      recognition.stop();
    };
  }, [lang, onSpeechStart, onResult, isAvailable]);

  const stop = useCallback(() => {
    stoppedByUserRef.current = true;
    if (segmentTimerRef.current !== null) {
      clearInterval(segmentTimerRef.current);
      segmentTimerRef.current = null;
    }
    recognitionRef.current?.stop();
  }, []);

  return { error, stop };
};
