import "~@/presentation/assets/globals.css";

import { useEffect, useState } from "react";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";
import { useSpeechToTranslateStatus } from "~@/presentation/hooks/useSpeechToTranslateStatus/useSpeechToTranslateStatus";
import { useSpeechToTranslateTabId } from "~@/presentation/hooks/useSpeechToTranslateTabId/useSpeechToTranslateTabId";
import { useSubtitleFontColor } from "~@/presentation/hooks/useSubtitleFontColor/useSubtitleFontColor";
import { useSubtitleFontSize } from "~@/presentation/hooks/useSubtitleFontSize/useSubtitleFontSize";
import { SubtitleControls } from "./controls/SubtitleControls";
import { SubtitleLine } from "./SubtitleLine";
import { SubtitleLoadingIndicator } from "./SubtitleLoadingIndicator";
import { useSubtitleEngine } from "./useSubtitleEngine";

const MAX_DISPLAY_LINES = 8;

/**
 * Full-page subtitle display rendered in an unlisted WXT page.
 * Designed to be captured as a Browser Source in OBS.
 *
 * Responsibilities:
 * - Reads target language from shared storage.
 * - Delegates speech recognition + translation to useSubtitleEngine.
 * - Closes itself when the feature is toggled off from the popup.
 * - Cleans up storage state on tab close.
 */
export const SubtitleDisplay = () => {
  const targetLanguageStorage = useLocalTranslatorTargetLanguage();
  const speechStatus = useSpeechToTranslateStatus();
  const speechTabId = useSpeechToTranslateTabId();
  const fontSizeStorage = useSubtitleFontSize();
  const fontColorStorage = useSubtitleFontColor();

  const [targetLanguage, setTargetLanguage] = useState("en");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#ffffff");

  // Load target language from storage and keep it in sync.
  useEffect(() => {
    targetLanguageStorage.getItem().then(setTargetLanguage);
    targetLanguageStorage.watchItem(setTargetLanguage);
  }, [targetLanguageStorage]);

  // Load font preferences from storage and keep them in sync.
  useEffect(() => {
    fontSizeStorage.getItem().then(setFontSize);
    fontSizeStorage.watchItem(setFontSize);
  }, [fontSizeStorage]);

  useEffect(() => {
    fontColorStorage.getItem().then(setFontColor);
    fontColorStorage.watchItem(setFontColor);
  }, [fontColorStorage]);

  const { lines, isTranslating, error, stop, clearLines } =
    useSubtitleEngine(targetLanguage);

  // If the feature is toggled off from the popup, stop recognition and close the tab.
  useEffect(() => {
    speechStatus.watchItem((isActive) => {
      if (!isActive) {
        stop();
        window.close();
      }
    });
  }, [speechStatus, stop]);

  // On tab close (manual or programmatic), clean up storage so the popup reflects
  // the correct state even if the tab was closed outside of the toggle flow.
  useEffect(() => {
    const handleUnload = () => {
      speechStatus.setItem(false);
      speechTabId.setItem(null);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [speechStatus, speechTabId]);

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    fontSizeStorage.setItem(size);
  };

  const handleFontColorChange = (color: string) => {
    setFontColor(color);
    fontColorStorage.setItem(color);
  };

  const displayLines = lines.slice(-MAX_DISPLAY_LINES);

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <p className="px-8 text-center text-2xl text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col justify-end bg-green-400 pb-8">
      <SubtitleControls
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        fontColor={fontColor}
        onFontColorChange={handleFontColorChange}
        onClear={clearLines}
      />
      <div className="flex flex-col items-start justify-center gap-2 py-4">
        {displayLines.map((line, index) => {
          const opacity = 0.3 + (0.7 * (index + 1)) / displayLines.length;
          return (
            <SubtitleLine
              key={`${index}-${line}`}
              text={line}
              opacity={opacity}
              fontSize={fontSize}
              color={fontColor}
            />
          );
        })}
        {isTranslating ? (
          <SubtitleLoadingIndicator />
        ) : (
          <div className="h-10" />
        )}
      </div>
    </div>
  );
};
