import { useCallback } from 'react';
import { fetchProfessor } from '../lib/professorRepository';
import { useAsyncResource } from './useAsyncResource';

/** Ready with null when the professor does not exist. */
export function useProfessor(professorId: string) {
  const load = useCallback(() => fetchProfessor(professorId), [professorId]);
  return useAsyncResource(load, 'Something went wrong on our side. Please try again in a moment.');
}
