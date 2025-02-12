/**
 *
 * Render the button for insert text on the website input
 * @param {QuickMessageProps} props see the interface
 * @return {JSX.Element}
 * @module components/QuickMessage/QuickMessage
 */

import { useCallback } from "react";
import { Button } from "@/components/ui/button";

export interface QuickMessageProps {
  label: string;
  text: string;
}

export const QuickMessage = ({ label, text }: QuickMessageProps) => {
  const onClick = useCallback(() => {
    /** is necesary to use document.execCommand to insert text into the active element becouse stripchat webpage have a implementation for prevent another text insertion method */
    document.execCommand("insertText", false, text);
  }, [text]);

  return (
    <Button onClick={onClick} variant="ghost" className="!sct-px-2">
      {label}
    </Button>
  );
};
