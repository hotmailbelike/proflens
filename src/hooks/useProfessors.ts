import { fetchProfessors } from '../lib/professorRepository';
import { useAsyncResource } from './useAsyncResource';

export function useProfessors() {
  return useAsyncResource(fetchProfessors, 'Something went wrong on our side. Please try again in a moment.');
}
