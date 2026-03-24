import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getQuickMessages,
  addQuickMessage,
  IQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";
import { normalizeJsonEntries } from "./utils";
import { IMPORT_FORM } from "../quickMessageOptions.strings.json";

export interface FormData {
  jsonData: string;
}

interface UseImportFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useImportForm = ({ onSuccess, onError }: UseImportFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
      const trimmedJsonData = values.jsonData.trim();
      if (!trimmedJsonData) {
        throw new Error(IMPORT_FORM.FORM_VALIDATION_MSG.REQUIRED);
      }

      // Parse JSON data using robust normalizer
      const parsedData = normalizeJsonEntries(trimmedJsonData);

      // Validate that we found at least one entry
      if (parsedData.length === 0) {
        throw new TypeError(IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_FORMAT);
      }

      // Validate each message has required properties (redundant check if regex works but good for safety if types change)
      const validMessages: IQuickMessage[] = parsedData.map((item) => {
        if (!item.label || !item.text) {
          // This case is largely handled by regex but if empty strings captured:
          throw new Error(IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_FORMAT);
        }
        return {
          label: String(item.label),
          text: String(item.text),
        };
      });

      // Get existing messages to avoid duplicates
      const existingMessages = await getQuickMessages();
      const existingLabels = new Set(existingMessages.map((m) => m.label));

      // Add new messages
      for (const message of validMessages) {
        if (!existingLabels.has(message.label)) {
          await addQuickMessage(message);
        }
      }

      // Reset form and call success callback
      form.reset();
      onSuccess?.();
      setSuccess(true);
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

  return {
    form,
    onSubmit,
    isLoading,
    error,
    success,
  };
};
