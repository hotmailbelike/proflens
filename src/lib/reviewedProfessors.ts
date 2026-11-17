// Remembers, on this device only, which professors the visitor has reviewed. It drives a friendly
// "You've reviewed this professor" note; it is not a limit, since anyone can clear their storage.

const STORAGE_KEY = 'proflens:reviewed-professors';

function readReviewedIds(): string[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    // Storage can be disabled (private browsing, blocked cookies) or hold invalid JSON.
    return [];
  }
}

export function hasReviewedProfessor(professorId: string): boolean {
  return readReviewedIds().includes(professorId);
}

export function markProfessorReviewed(professorId: string): void {
  const reviewedIds = readReviewedIds();
  if (reviewedIds.includes(professorId)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...reviewedIds, professorId]));
  } catch {
    // Losing the note is harmless; the review itself is already saved.
  }
}
