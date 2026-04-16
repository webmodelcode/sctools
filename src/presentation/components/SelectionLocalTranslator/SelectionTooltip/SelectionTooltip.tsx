import { useState } from "react";
import { Copy, Check, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "~@/presentation/components/ui/button";
import languagesSupported from "~@/presentation/components/LanguageSelector/languagesSupported";
import { LanguageSelectorControlled } from "~@/presentation/components/LanguageSelector/LanguageSelectorControlled";
import { TranslationStatus } from "../hooks/useSelectionTranslation";

export interface SelectionTooltipProps {
  status: TranslationStatus;
  translatedText: string | null;
  sourceLanguage: string | null;
  errorMessage?: string;
  onRetry: () => void;
  onLanguageChange: (lang: string) => void;
  targetLanguage: string;
}

export const SelectionTooltip = ({
  status,
  translatedText,
  sourceLanguage,
  errorMessage,
  onRetry,
  onLanguageChange,
  targetLanguage,
}: SelectionTooltipProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceLangLabel = sourceLanguage
    ? (languagesSupported.find((l) => l.value === sourceLanguage)?.label ?? sourceLanguage)
    : null;

  return (
    <div
      data-testid="selection-tooltip"
      className="flex min-w-48 max-w-xs flex-col gap-2 rounded-lg border border-ew-star-color bg-background p-3 shadow-lg"
    >
      <LanguageSelectorControlled
        value={targetLanguage}
        onChange={onLanguageChange}
        tooltipText="Selecciona el idioma al que deseas traducir la selección"
      />

      {status === "translating" && (
        <div className="flex items-center justify-center py-2" data-testid="spinner">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {status === "done" && (
        <div className="flex flex-col gap-1">
          <p data-testid="translated-text" className="text-sm">
            {translatedText}
          </p>
          {sourceLangLabel && (
            <span data-testid="source-language" className="text-xs text-muted-foreground">
              Desde: {sourceLangLabel}
            </span>
          )}
          <Button
            data-testid="copy-button"
            size="sm"
            variant="outline"
            className="mt-1 self-end"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3" data-testid="check-icon" />
            ) : (
              <Copy className="h-3 w-3" data-testid="copy-icon" />
            )}
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-1">
          <p data-testid="error-message" className="text-sm text-destructive">
            {errorMessage ?? "Error al traducir"}
          </p>
          <Button
            data-testid="retry-button"
            size="sm"
            variant="outline"
            onClick={onRetry}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
};
