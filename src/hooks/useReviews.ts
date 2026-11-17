import { useCallback } from 'react';
import { fetchReviews } from '../lib/reviewRepository';
import { useAsyncResource } from './useAsyncResource';

export function useReviews(professorId: string) {
  const load = useCallback(() => fetchReviews(professorId), [professorId]);
  return useAsyncResource(load, 'Reviews could not be loaded.');
}
