/**
 * React Component for show a alert in screen
 * @param  {FloatAlertProps} props
 * @returns {JSX.Element}
 *
 * @module components/FloatAlert
 */

import { Terminal, AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~@/presentation/components/ui/alert";

export interface FloatAlertProps {
  message: string;
  title?: string;
  destructive?: boolean;
}

export const FloatAlert = ({
  title = "",
  message,
  destructive = false,
}: FloatAlertProps) => {
  return (
    <Alert variant={destructive ? "destructive" : "default"}>
      {destructive ? (
        <AlertCircle className="h-4 w-4 !text-destructive" />
      ) : (
        <Terminal className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
