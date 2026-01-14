/**
 * React Component for show a alert in screen
 * @param  {FloatAlertProps} props
 * @returns {JSX.Element}
 *
 * @module components/FloatAlert
 */

import { Terminal, AlertCircle, CheckCircle2Icon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~@/presentation/components/ui/alert";

export interface FloatAlertProps {
  message: string;
  title?: string;
  success?: boolean;
  destructive?: boolean;
}

export const FloatAlert = ({
  title = "",
  message,
  success = false,
  destructive = false,
}: FloatAlertProps) => {
  return (
    <Alert variant={destructive ? "destructive" : "default"}>
      {destructive ? (
        <AlertCircle className="h-4 w-4 !text-destructive" />
      ) : success ? (
        <CheckCircle2Icon
          className="h-4 w-4 !text-emerald-500"
          data-testid="success-icon"
        />
      ) : (
        <Terminal className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
