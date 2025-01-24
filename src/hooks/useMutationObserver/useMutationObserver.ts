import { useEffect, type MutableRefObject } from "react";

interface MutationObserverProps {
  ref: MutableRefObject<Element | null>;
  callback: MutationCallback;
  options?: MutationObserverInit;
}

export const useMutationObserver = ({
  ref,
  callback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
}: MutationObserverProps) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [callback, options, ref]);
};
