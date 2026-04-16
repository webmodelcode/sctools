import { useEffect, useRef, useState } from "react";
import { useSelectionTranslatorStatus } from "~@/presentation/hooks/useSelectionTranslatorStatus/useSelectionTranslatorStatus";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";
import { useTextSelection } from "./hooks/useTextSelection";
import { useSelectionTranslation } from "./hooks/useSelectionTranslation";
import { SelectionBubble } from "./SelectionBubble/SelectionBubble";
import { SelectionTooltip } from "./SelectionTooltip/SelectionTooltip";

export const SelectionLocalTranslator = () => {
  const selectionTranslatorStatus = useSelectionTranslatorStatus();
  const targetLanguageStorage = useLocalTranslatorTargetLanguage();
  const { selection } = useTextSelection();
  const { status, translatedText, sourceLanguage, errorMessage, translate, reset } =
    useSelectionTranslation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    selectionTranslatorStatus.getItem().then(setIsEnabled);
    targetLanguageStorage.getItem().then((val) => setTargetLanguage(val ?? "en"));
  }, []);

  selectionTranslatorStatus.watchItem(setIsEnabled);
  targetLanguageStorage.watchItem((val) => setTargetLanguage(val ?? "en"));

  const prevSelectionText = useRef<string | null>(null);
  useEffect(() => {
    const newText = selection?.text ?? null;
    if (newText !== prevSelectionText.current) {
      prevSelectionText.current = newText;
      setIsTooltipOpen(false);
      reset();
    }
  }, [selection, reset]);

  if (!isEnabled) return null;

  const handleBubbleHover = () => {
    setIsTooltipOpen(true);
    if (selection) {
      translate(selection.text, targetLanguage);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    await targetLanguageStorage.setItem(lang);
    if (selection) {
      translate(selection.text, lang);
    }
  };

  const handleRetry = () => {
    if (selection) {
      translate(selection.text, targetLanguage);
    }
  };

  return (
    <>
      {selection && <SelectionBubble rect={selection.rect} onHover={handleBubbleHover} />}
      {isTooltipOpen && selection && (
        <div
          style={{
            position: "absolute",
            top: `${selection.rect.bottom + window.scrollY + 8}px`,
            left: `${selection.rect.left + window.scrollX}px`,
            zIndex: 1000000,
          }}
        >
          <SelectionTooltip
            status={status}
            translatedText={translatedText}
            sourceLanguage={sourceLanguage}
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onLanguageChange={handleLanguageChange}
            targetLanguage={targetLanguage}
          />
        </div>
      )}
    </>
  );
};
