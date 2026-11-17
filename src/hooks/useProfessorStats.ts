import { useCallback, useMemo } from 'react';
import type { Professor } from '../lib/types';
import { fetchStatsForProfessors } from '../lib/reviewRepository';
import { useAsyncResource } from './useAsyncResource';

const ID_SEPARATOR = '|';

/** Ratings and review counts for the home list, fetched once the professors are known. */
export function useProfessorStats(professors: Professor[]) {
  // A string key keeps the loader stable across renders that rebuild the professors array.
  const idsKey = useMemo(() => professors.map((professor) => professor.id).join(ID_SEPARATOR), [professors]);
  const load = useCallback(
    () => fetchStatsForProfessors(idsKey.length > 0 ? idsKey.split(ID_SEPARATOR) : []),
    [idsKey],
  );
  return useAsyncResource(load, 'Ratings could not be loaded.');
}
