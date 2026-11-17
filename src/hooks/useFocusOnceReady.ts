import { useEffect, useRef, type RefObject } from 'react';

/** Scrolls to and focuses `targetRef` the first time `isReady` is true, such as a just-posted review. */
export function useFocusOnceReady(targetRef: RefObject<HTMLElement | null>, isReady: boolean): void {
  const hasFocused = useRef(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!isReady || hasFocused.current || target === null) return;
    hasFocused.current = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
  }, [targetRef, isReady]);
}
