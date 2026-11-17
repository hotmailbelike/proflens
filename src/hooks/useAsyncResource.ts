import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from '../lib/asyncState';
import { describeFirestoreError } from '../lib/describeFirestoreError';

interface AsyncResource<T> {
  state: AsyncState<T>;
  retry: () => void;
}

interface SettledResult<T> {
  load: () => Promise<T>;
  attempt: number;
  state: AsyncState<T>;
}

const LOADING = { status: 'loading' } as const;

/**
 * Runs `load` (which must be memoised) and tracks its result. A result is only shown for the load
 * and attempt that produced it, so a new load or a retry reads as loading without resetting state
 * inside the effect, and a late response from an earlier load is ignored.
 */
export function useAsyncResource<T>(load: () => Promise<T>, errorMessage: string): AsyncResource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<SettledResult<T> | null>(null);

  useEffect(() => {
    let isCurrent = true;
    load().then(
      (data) => {
        if (isCurrent) setSettled({ load, attempt, state: { status: 'ready', data } });
      },
      (error: unknown) => {
        console.error(errorMessage, error);
        const message = describeFirestoreError(error, { fallback: errorMessage });
        if (isCurrent) setSettled({ load, attempt, state: { status: 'error', message } });
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [load, attempt, errorMessage]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const isSettledForThisLoad = settled !== null && settled.load === load && settled.attempt === attempt;
  return { state: isSettledForThisLoad ? settled.state : LOADING, retry };
}
