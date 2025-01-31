import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface QuickMessageProps {
  label: string;
  text: string;
}

export const QuickMessage = ({ label, text }: QuickMessageProps) => {
  const onClick = useCallback(() => {
    document.execCommand("insertText", false, text);
  }, [text]);

  return (
    <Button onClick={onClick} variant="ghost" className="sct-px-2 sct-m-1 ">
      {label}
    </Button>
  );
};
