import { useEffect, useRef, useState } from "react";
import { ScrollAreaRef } from "~@/presentation/components/ui/scroll-area";

export const useChatScroll = <T extends unknown[]>(dependencies: T) => {
  const scrollRef = useRef<ScrollAreaRef>(null);

  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (dependencies.length === 0) return;

    if (!isAtBottom) setShowScrollBottomButton(true);
  }, [dependencies, isAtBottom]);

  const handleScrollStateChange = ({
    canScrollDown,
  }: {
    canScrollDown: boolean;
  }) => {
    const atBottom = !canScrollDown;
    setIsAtBottom(atBottom);

    if (atBottom) {
      setShowScrollBottomButton(false);
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollToBottom();
  };

  return {
    scrollRef,
    showScrollBottomButton,
    scrollToBottom,
    handleScrollStateChange,
  };
};
