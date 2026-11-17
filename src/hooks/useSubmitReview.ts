import { useCallback, useState } from 'react';
import { describeFirestoreError } from '../lib/describeFirestoreError';
import { createReview } from '../lib/reviewRepository';
import type { NewReview } from '../lib/types';

type SubmitState = { status: 'idle' } | { status: 'submitting' } | { status: 'error'; message: string };

const SUBMIT_ERROR_COPY = {
  fallback: 'Your review could not be posted. Please try again.',
  permissionDenied:
    'Your review was not accepted. Check that every answer is filled in and the review is 20 to 350 characters.',
};

/** Resolves to the new review id, or null when posting failed and `state` holds the reason. */
export function useSubmitReview(professorId: string) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });

  const submit = useCallback(
    async (review: NewReview): Promise<string | null> => {
      setState({ status: 'submitting' });
      try {
        const reviewId = await createReview(professorId, review);
        setState({ status: 'idle' });
        return reviewId;
      } catch (error) {
        console.error('Posting a review failed.', error);
        setState({ status: 'error', message: describeFirestoreError(error, SUBMIT_ERROR_COPY) });
        return null;
      }
    },
    [professorId],
  );

  return { state, submit };
}
