/**
 * Custom hook for observing DOM mutations using the `MutationObserver` API.
 * This hook allows you to observe changes to a DOM element and execute a callback
 * when mutations occur.
 *
 * @param {MutationObserverProps} props see the interface for more.
 * @module hooks/useMutationObserver
 */

import { useEffect, type RefObject } from "react";

export interface MutationObserverProps {
  ref: RefObject<Element | null>;
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
