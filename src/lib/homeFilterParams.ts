import type { HomeFilters } from './types';

const QUERY_PARAM = 'q';
const UNIVERSITY_PARAM = 'university';

export function readHomeFilters(search: string): HomeFilters {
  const params = new URLSearchParams(search);
  return {
    query: params.get(QUERY_PARAM) ?? '',
    university: params.get(UNIVERSITY_PARAM),
  };
}

/**
 * Mirrors the search into the address bar so Back from a professor restores it. replaceState keeps
 * typing out of the history stack and does not notify the router, so the page is not re-parsed.
 */
export function writeHomeFilters({ query, university }: HomeFilters): void {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();
  if (trimmedQuery.length > 0) params.set(QUERY_PARAM, trimmedQuery);
  if (university !== null) params.set(UNIVERSITY_PARAM, university);

  const search = params.toString();
  const nextUrl = search.length > 0 ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(window.history.state, '', nextUrl);
}
