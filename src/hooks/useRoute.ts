import { useMemo, useSyncExternalStore } from 'react';
import { currentLocation, subscribeToNavigation } from '../lib/navigation';
import { parseRoute, type Route } from '../lib/routes';

export function useRoute(): Route {
  const location = useSyncExternalStore(subscribeToNavigation, currentLocation);
  return useMemo(() => {
    const url = new URL(location, window.location.origin);
    return parseRoute(url.pathname, url.search);
  }, [location]);
}
