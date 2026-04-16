import { useCallback, useEffect, useState } from "react";

interface TextSelection {
  text: string;
  rect: DOMRect;
}

export interface UseTextSelectionReturn {
  selection: TextSelection | null;
  clearSelection: () => void;
}

export const useTextSelection = (): UseTextSelectionReturn => {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = document.getSelection();
      if (!sel || sel.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const text = sel.toString();
      if (text.trim().length < 3) {
        setSelection(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({ text, rect });
    };

    const handleScroll = () => {
      setSelection(null);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return { selection, clearSelection };
};
