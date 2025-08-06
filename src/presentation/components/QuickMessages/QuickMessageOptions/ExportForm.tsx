/**
 * ExportForm Component
 *
 * A component for exporting quick messages as JSON text.
 * Displays messages in plain text and provides a copy to clipboard button.
 */

import { useState, useEffect } from "react";
import { Clipboard } from "lucide-react";
import { Button } from "~@/presentation/components/ui/button";
import { Label } from "~@/presentation/components/ui/label";
import { handleExportQuickMessages } from "./handlers";
import { EXPORT_FORM } from "./quickMessageOptions.strings.json";
import { cn } from "~@/presentation/lib/utils";

interface ExportFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ExportForm = ({ onSuccess, onError }: ExportFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exportData, setExportData] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const data = await handleExportQuickMessages();
        setExportData(JSON.stringify(data, null, 2));
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al exportar mensajes";
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [onSuccess, onError]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      onError?.(EXPORT_FORM.ERROR_COPY);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exportData">{EXPORT_FORM.LABEL}</Label>
        <textarea
          id="exportData"
          value={exportData}
          readOnly
          className={cn(
            "flex max-h-[250px] min-h-[200px] w-full rounded-md border border-input bg-muted px-3 py-2 font-mono text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          )}
          placeholder={
            isLoading ? EXPORT_FORM.LOADING_MESSAGES : EXPORT_FORM.NO_MESSAGES
          }
        />
        <p className="text-sm text-muted-foreground">
          {EXPORT_FORM.DESCRIPTION}
        </p>
      </div>

      <Button
        onClick={handleCopyToClipboard}
        disabled={!exportData || isLoading}
        className="w-full"
        variant={copySuccess ? "default" : "outline"}
      >
        <Clipboard className="mr-2 h-4 w-4" />
        {copySuccess ? EXPORT_FORM.COPY_SUCCESS : EXPORT_FORM.COPY_BUTTON}
      </Button>
    </div>
  );
};
