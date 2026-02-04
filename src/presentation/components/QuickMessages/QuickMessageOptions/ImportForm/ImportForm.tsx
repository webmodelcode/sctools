/**
 * ImportForm Component
 *
 * A form component for importing quick messages from JSON text input.
 * Uses shadcn/ui form components with validation.
 */

import { Button } from "~@/presentation/components/ui/button";
import { Form } from "~@/presentation/components/ui/form";
import { cn } from "~@/presentation/lib/utils";
import { IMPORT_FORM } from "../quickMessageOptions.strings.json";
import { FloatAlert } from "../../../FloatAlert/FloatAlert";
import { useImportForm } from "./useImportForm";

interface ImportFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ImportForm = ({ onSuccess, onError }: ImportFormProps) => {
  const { form, onSubmit, isLoading, error, success } = useImportForm({
    onSuccess,
    onError,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          {!success && (
            <div data-testid="import-form-input">
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
                  "mt-2 flex max-h-[250px] min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                )}
                {...form.register("jsonData")}
              />
            </div>
          )}
          {error && (
            <FloatAlert
              title={"Error al importar"}
              message={error}
              destructive
            />
          )}
          {success && (
            <FloatAlert
              title={"Mensajes importados con éxito"}
              message={"Ya sus mensajes están disponibles para usar"}
              success
            />
          )}
          <p className="text-sm text-muted-foreground">
            {IMPORT_FORM.DESCRIPTION}
          </p>
        </div>
        <Button
          type="submit"
          disabled={isLoading || success}
          className="w-full"
        >
          {isLoading ? IMPORT_FORM.LOADING_IMPORT : IMPORT_FORM.IMPORT_BUTTON}
        </Button>
      </form>
    </Form>
  );
};
