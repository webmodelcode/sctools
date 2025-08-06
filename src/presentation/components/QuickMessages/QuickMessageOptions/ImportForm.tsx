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
import { IMPORT_FORM } from "./quickMessageOptions.strings.json";

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
        throw new Error(IMPORT_FORM.FORM_VALIDATION_MSG.REQUIRED);
      }

      // Parse JSON data
      const parsedData = JSON.parse(values.jsonData);

      // Validate that it's an array
      if (!Array.isArray(parsedData)) {
        throw new Error(IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_FORMAT);
      }

      // Validate each message has required properties
      const validMessages: IQuickMessage[] = parsedData.map((item, index) => {
        if (!item.label || !item.text) {
          throw new Error(
            `${IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_CONTENT}${index + 1}`,
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
        errorMessage = IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_FORMAT;
      } else {
        errorMessage =
          error instanceof Error
            ? error.message
            : IMPORT_FORM.FORM_VALIDATION_MSG.GENERIC_ERROR;
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
          <label
            htmlFor="jsonData"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {IMPORT_FORM.LABEL}
          </label>
          <textarea
            id="jsonData"
            placeholder={IMPORT_FORM.EXAMPLE_PLACEHOLDER}
            className={cn(
              "flex max-h-[250px] min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
            {...form.register("jsonData")}
          />
          <p className="text-sm text-muted-foreground">
            {IMPORT_FORM.DESCRIPTION}
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? IMPORT_FORM.LOADING_IMPORT : IMPORT_FORM.IMPORT_BUTTON}
        </Button>
      </form>
    </Form>
  );
};
