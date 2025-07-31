/**
 * ImportForm Component
 *
 * A form component for importing quick messages from JSON text input.
 * Uses shadcn/ui form components with validation.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~@/presentation/components/ui/button";
import { Form } from "~@/presentation/components/ui/form";
import {
  getQuickMessages,
  addQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";
import type { IQuickMessage } from "~@/infrastructure/datasource/quickMessages.local.datasource";
import { cn } from "~@/presentation/lib/utils";

interface FormData {
  jsonData: string;
}

interface ImportFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ImportForm = ({ onSuccess, onError }: ImportFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    defaultValues: {
      jsonData: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Validate input is not empty
      if (!values.jsonData.trim()) {
        throw new Error("Por favor ingresa los datos JSON.");
      }

      // Parse JSON data
      const parsedData = JSON.parse(values.jsonData);

      // Validate that it's an array
      if (!Array.isArray(parsedData)) {
        throw new Error("Los datos deben ser un array de mensajes.");
      }

      // Validate each message has required properties
      const validMessages: IQuickMessage[] = parsedData.map((item, index) => {
        if (!item.label || !item.text) {
          throw new Error(
            `El mensaje en la posición ${index + 1} debe tener 'label' y 'text'.`,
          );
        }
        return {
          label: String(item.label),
          text: String(item.text),
        };
      });

      // Get existing messages to avoid duplicates
      const existingMessages = await getQuickMessages();
      const existingLabels = existingMessages.map((m) => m.label);

      // Add new messages
      for (const message of validMessages) {
        if (!existingLabels.includes(message.label)) {
          await addQuickMessage(message);
        }
      }

      // Reset form and call success callback
      form.reset();
      onSuccess?.();
    } catch (error) {
      let errorMessage: string;
      if (error instanceof SyntaxError) {
        errorMessage = "JSON inválido. Verifica el formato.";
      } else {
        errorMessage =
          error instanceof Error
            ? error.message
            : "Error al procesar los datos JSON.";
      }
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="jsonData" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Datos JSON</label>
          <textarea
            id="jsonData"
            placeholder={`Ejemplo:\n[\n  {"label": "importado1", "text": "msg importado 1"},\n  {"label": "importado2", "text": "msg importado 2"}\n]`}
            className={cn(
              "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...form.register("jsonData")}
          />
          <p className="text-sm text-muted-foreground">
            Ingresa un array JSON con los mensajes rápidos a importar.
          </p>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Importando..." : "Importar Mensajes"}
        </Button>
      </form>
    </Form>
  );
};
