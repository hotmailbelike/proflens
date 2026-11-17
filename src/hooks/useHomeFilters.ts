import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readHomeFilters, writeHomeFilters } from '../lib/homeFilterParams';
import { subscribeToNavigation } from '../lib/navigation';
import { homePath } from '../lib/routes';
import type { HomeFilters } from '../lib/types';

/** An old or edited link may name a university that is not in the data. */
function readKnownFilters(search: string, universities: string[]): HomeFilters {
  const fromUrl = readHomeFilters(search);
  const isKnownUniversity = fromUrl.university !== null && universities.includes(fromUrl.university);
  return { ...fromUrl, university: isKnownUniversity ? fromUrl.university : null };
}

/**
 * The home search, kept in step with the address bar both ways: typing replaces the URL, and a
 * navigation that stays on the home page (the logo link to "/", or Back to "/?q=…") reloads the
 * filters, since the home page stays mounted across those.
 */
export function useHomeFilters(universities: string[]): [HomeFilters, Dispatch<SetStateAction<HomeFilters>>] {
  const [filters, setFilters] = useState<HomeFilters>(() =>
    readKnownFilters(window.location.search, universities),
  );

  useEffect(() => {
    writeHomeFilters(filters);
  }, [filters]);

  useEffect(
    () =>
      subscribeToNavigation(() => {
        // Leaving for a professor page also notifies; writing filters there would rewrite its URL.
        if (window.location.pathname !== homePath()) return;
        setFilters(readKnownFilters(window.location.search, universities));
      }),
    [universities],
  );

  return [filters, setFilters];
}
