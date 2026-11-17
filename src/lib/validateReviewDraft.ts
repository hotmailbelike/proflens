import { countCharacters } from './countCharacters';
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH, MAX_REVIEW_TAGS } from './reviewOptions';
import type { NewReview, ReviewDraft, ReviewFieldErrors } from './types';

export type ReviewValidation = { isValid: true; review: NewReview } | { isValid: false; errors: ReviewFieldErrors };

/** Mirrors firestore.rules so students see a specific message instead of a rejected write. */
export function validateReviewDraft(draft: ReviewDraft, courses: string[]): ReviewValidation {
  const errors: ReviewFieldErrors = {};
  const comment = draft.comment.trim();
  const commentLength = countCharacters(comment);

  if (!courses.includes(draft.course)) errors.course = 'Choose the course you took.';
  if (draft.rating === null) errors.rating = 'Rate the professor from 1 to 5.';
  if (draft.difficulty === null) errors.difficulty = 'Rate how difficult the course was.';
  if (draft.wouldTakeAgain === null) errors.wouldTakeAgain = 'Say whether you would take this professor again.';
  if (draft.forCredit === null) errors.forCredit = 'Say whether you took the course for credit.';
  if (draft.textbookUsed === null) errors.textbookUsed = 'Say whether a textbook was used.';
  if (draft.attendanceMandatory === null) errors.attendanceMandatory = 'Say whether attendance was mandatory.';
  if (draft.grade === '') errors.grade = 'Choose your grade, or "Not sure yet" or "Rather not say".';
  if (draft.tags.length > MAX_REVIEW_TAGS) errors.tags = `Pick at most ${MAX_REVIEW_TAGS} tags.`;
  if (commentLength < COMMENT_MIN_LENGTH) {
    errors.comment = `Write at least ${COMMENT_MIN_LENGTH} characters so other students get the full picture.`;
  } else if (commentLength > COMMENT_MAX_LENGTH) {
    errors.comment = `Keep your review to ${COMMENT_MAX_LENGTH} characters.`;
  }

  const { rating, difficulty, wouldTakeAgain, forCredit, textbookUsed, attendanceMandatory, grade } = draft;
  const hasErrors = Object.keys(errors).length > 0;
  // The null checks repeat the ones above so TypeScript can narrow the draft into a NewReview.
  if (
    hasErrors ||
    rating === null ||
    difficulty === null ||
    wouldTakeAgain === null ||
    forCredit === null ||
    textbookUsed === null ||
    attendanceMandatory === null ||
    grade === ''
  ) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    review: {
      course: draft.course,
      rating,
      difficulty,
      wouldTakeAgain,
      forCredit,
      textbookUsed,
      attendanceMandatory,
      grade,
      tags: draft.tags,
      comment,
    },
  };
}
