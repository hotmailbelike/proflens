import type { ReviewDraft, ReviewField } from './types';

export const EMPTY_REVIEW_DRAFT: ReviewDraft = {
  course: '',
  rating: null,
  difficulty: null,
  wouldTakeAgain: null,
  forCredit: null,
  textbookUsed: null,
  attendanceMandatory: null,
  grade: '',
  tags: [],
  comment: '',
};

/** Form order, which the error summary follows. */
export const REVIEW_FIELD_ORDER: ReviewField[] = [
  'course',
  'rating',
  'difficulty',
  'wouldTakeAgain',
  'forCredit',
  'textbookUsed',
  'attendanceMandatory',
  'grade',
  'tags',
  'comment',
];

export const reviewFieldId = (field: ReviewField) => `review-${field}`;
export const reviewFieldErrorId = (field: ReviewField) => `review-${field}-error`;
