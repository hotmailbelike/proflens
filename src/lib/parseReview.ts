import { Timestamp, type DocumentData } from 'firebase/firestore';
import { isGrade, isReviewTag, isScore } from './reviewOptions';
import type { Review } from './types';

/** The rules validate every review on write; this guards the UI against anything older or seeded by hand. */
export function parseReview(id: string, data: DocumentData): Review | null {
  const {
    course,
    rating,
    difficulty,
    wouldTakeAgain,
    forCredit,
    textbookUsed,
    attendanceMandatory,
    grade,
    tags,
    comment,
    createdAt,
  } = data;
  const hasValidFields =
    typeof course === 'string' &&
    isScore(rating) &&
    isScore(difficulty) &&
    typeof wouldTakeAgain === 'boolean' &&
    typeof forCredit === 'boolean' &&
    typeof textbookUsed === 'boolean' &&
    typeof attendanceMandatory === 'boolean' &&
    isGrade(grade) &&
    Array.isArray(tags) &&
    tags.every(isReviewTag) &&
    typeof comment === 'string' &&
    createdAt instanceof Timestamp;
  if (!hasValidFields) {
    console.warn(`Skipping review ${id}: its document does not have the expected fields.`);
    return null;
  }
  return {
    id,
    course,
    rating,
    difficulty,
    wouldTakeAgain,
    forCredit,
    textbookUsed,
    attendanceMandatory,
    grade,
    tags,
    comment,
    createdAt: createdAt.toDate(),
  };
}
