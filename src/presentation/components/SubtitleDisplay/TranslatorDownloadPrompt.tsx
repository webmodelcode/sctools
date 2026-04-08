import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Input } from "../ui/input";

interface TranslatorDownloadPromptProps {
  onRetry: (onProgress?: (loaded: number) => void) => Promise<void>;
}

type Status = "idle" | "downloading" | "error";

/**
 * Shown when the Translator API throws NotAllowedError because the model
 * needs to be downloaded but no user gesture has occurred yet.
 *
 * Invites the user to type in an uncontrolled input, which acts as the
 * required user gesture to trigger the model download.
 */
export const TranslatorDownloadPrompt = ({ onRetry }: TranslatorDownloadPromptProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const hasTriggeredRef = useRef(false);

  const handleChange = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setStatus("downloading");

    onRetry((loaded) => setProgress(loaded))
      .catch(() => {
        setStatus("error");
        hasTriggeredRef.current = false;
      });
  };

  if (status === "error") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <p className="px-8 text-center text-2xl text-red-400">
          No se pudo descargar el modelo. Recarga la página e intenta de nuevo.
        </p>
      </div>
    );
  }

  if (status === "downloading") {
    const percent = Math.round(progress * 100);
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-white/70" />
        <p className="text-xl text-white/80">Descargando modelo de traducción…</p>
        {percent > 0 && (
          <p className="text-lg text-white/50">{percent}%</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-black">
      <Download className="h-12 w-12 text-white/60" />
      <div className="flex max-w-md flex-col items-center gap-3 px-8 text-center">
        <p className="text-2xl font-medium text-white">Modelo de traducción no descargado</p>
        <p className="text-base text-white/60">
          Escribe algo en el campo de abajo para iniciar la descarga.
        </p>
      </div>
      <Input
        className="w-64 border-white/30 bg-white/10 text-white placeholder:text-white/40"
        placeholder="Escribe aquí para iniciar…"
        onChange={handleChange}
      />
    </div>
  );
};
