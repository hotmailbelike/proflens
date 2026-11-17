import { useEffect, useState } from 'react';
import { professorPath } from '../lib/routes';

/**
 * The ?review= marker only carries a new review's id across the redirect from the form. The page
 * keeps the id in state and drops the marker from the address bar, so a reload or a shared link
 * does not greet someone else with "Your review".
 */
export function useHighlightOnce(professorId: string, highlightFromUrl: string | null): string | null {
  const [highlightedReviewId] = useState(highlightFromUrl);

  useEffect(() => {
    if (highlightedReviewId === null) return;
    window.history.replaceState(window.history.state, '', professorPath(professorId));
  }, [professorId, highlightedReviewId]);

  return highlightedReviewId;
}
