import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FloatAlertProps {
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
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
