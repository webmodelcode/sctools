// The Web Speech API is not included in all TypeScript DOM lib configurations.
// We use `any` locally to avoid requiring extra lib declarations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionAny = any;

interface IWebSpeechRecognitionConfig {
  lang: string;
  onSpeechStart: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (event: { error: string }) => void;
}

/**
 * Thin wrapper around the Web Speech API following the datasource pattern.
 * Handles vendor prefix (webkitSpeechRecognition) transparently.
 *
 * @property isAvailable Checks if SpeechRecognition is available in the current environment.
 * @property create Creates a configured SpeechRecognition instance. The caller is responsible
 *                  for calling start() / stop() on the returned instance.
 */
export const localSpeechRecognition = {
  isAvailable: () =>
    typeof globalThis !== "undefined" &&
    ("SpeechRecognition" in globalThis ||
      "webkitSpeechRecognition" in globalThis),

  create: ({
    lang,
    onSpeechStart,
    onResult,
    onEnd,
    onError,
  }: IWebSpeechRecognitionConfig): SpeechRecognitionAny => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = globalThis as any;
    const SpeechRecognitionClass =
      w.SpeechRecognition ?? w.webkitSpeechRecognition;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onspeechstart = onSpeechStart;
    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        onResult(result[0].transcript, result.isFinal);
      }
    };

    recognition.onend = onEnd;
    recognition.onerror = onError;

    return recognition;
  },
};
