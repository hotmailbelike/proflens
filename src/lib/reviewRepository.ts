import {
  addDoc,
  average,
  collection,
  count,
  getAggregateFromServer,
  getDocsFromServer,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { PROFESSORS_COLLECTION, REVIEWS_SUBCOLLECTION } from './collections';
import { getDb } from './firebase';
import { parseReview } from './parseReview';
import type { NewReview, ProfessorStats, Review } from './types';

const reviewsOf = (professorId: string) =>
  collection(getDb(), PROFESSORS_COLLECTION, professorId, REVIEWS_SUBCOLLECTION);

/**
 * Newest first. A single-field order needs no composite index. Read from the server so that being
 * offline shows the offline message rather than an empty cache result that reads as "no reviews".
 */
export async function fetchReviews(professorId: string): Promise<Review[]> {
  const snapshot = await getDocsFromServer(query(reviewsOf(professorId), orderBy('createdAt', 'desc')));
  return snapshot.docs
    .map((reviewDoc) => parseReview(reviewDoc.id, reviewDoc.data()))
    .filter((review): review is Review => review !== null);
}

/**
 * The home list shows a rating for every professor without downloading their reviews: an
 * aggregation query is billed as one read per 1,000 reviews it covers, and the server does the math.
 */
async function fetchProfessorStats(professorId: string): Promise<ProfessorStats> {
  const snapshot = await getAggregateFromServer(reviewsOf(professorId), {
    reviewCount: count(),
    averageRating: average('rating'),
  });
  const { reviewCount, averageRating } = snapshot.data();
  return { reviewCount, averageRating };
}

export async function fetchStatsForProfessors(professorIds: string[]): Promise<Map<string, ProfessorStats>> {
  const entries = await Promise.all(
    professorIds.map(async (professorId) => [professorId, await fetchProfessorStats(professorId)] as const),
  );
  return new Map(entries);
}

/** Resolves to the new review's id. createdAt is set by the server so the rules can pin it to request.time. */
export async function createReview(professorId: string, review: NewReview): Promise<string> {
  const reviewRef = await addDoc(reviewsOf(professorId), { ...review, createdAt: serverTimestamp() });
  return reviewRef.id;
}
