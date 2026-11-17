export type Route =
  | { name: 'home' }
  | { name: 'professor'; professorId: string; highlightedReviewId: string | null }
  | { name: 'rate'; professorId: string }
  | { name: 'not-found' };

const PROFESSOR_PREFIX = 'p';
const RATE_SEGMENT = 'rate';
const HIGHLIGHT_PARAM = 'review';
// Seeded professor ids are lowercase slugs such as "odalys-brennwick".
const PROFESSOR_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Only reviews posted from the app (Firestore auto ids) are ever highlighted.
const REVIEW_ID_PATTERN = /^[A-Za-z0-9]{20}$/;

export const homePath = () => '/';
export const ratePath = (professorId: string) => `/${PROFESSOR_PREFIX}/${professorId}/${RATE_SEGMENT}`;

export function professorPath(professorId: string, highlightedReviewId?: string): string {
  const path = `/${PROFESSOR_PREFIX}/${professorId}`;
  if (highlightedReviewId === undefined) return path;
  return `${path}?${new URLSearchParams({ [HIGHLIGHT_PARAM]: highlightedReviewId }).toString()}`;
}

function readHighlightedReviewId(search: string): string | null {
  const reviewId = new URLSearchParams(search).get(HIGHLIGHT_PARAM);
  return reviewId !== null && REVIEW_ID_PATTERN.test(reviewId) ? reviewId : null;
}

export function parseRoute(pathname: string, search: string): Route {
  const segments = pathname.split('/').filter((segment) => segment.length > 0);
  if (segments.length === 0) return { name: 'home' };

  const [prefix, professorId, action, ...rest] = segments;
  const isProfessorPath =
    prefix === PROFESSOR_PREFIX && professorId !== undefined && PROFESSOR_ID_PATTERN.test(professorId);
  if (!isProfessorPath || rest.length > 0) return { name: 'not-found' };

  if (action === undefined) {
    return { name: 'professor', professorId, highlightedReviewId: readHighlightedReviewId(search) };
  }
  if (action === RATE_SEGMENT) return { name: 'rate', professorId };
  return { name: 'not-found' };
}

/** Identifies the view a route renders, so view-level state can be reset when it changes. */
export function routeKey(route: Route): string {
  switch (route.name) {
    case 'professor':
    case 'rate':
      return `${route.name}:${route.professorId}`;
    case 'home':
    case 'not-found':
      return route.name;
  }
}
