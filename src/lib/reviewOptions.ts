// The values a review may hold. firestore.rules repeats these lists, so change both together.

export const SCORES = [1, 2, 3, 4, 5] as const;
export type Score = (typeof SCORES)[number];

export const RATING_LABELS: Record<Score, string> = {
  1: 'Awful',
  2: 'OK',
  3: 'Good',
  4: 'Great',
  5: 'Awesome',
};

export const DIFFICULTY_LABELS: Record<Score, string> = {
  1: 'Very easy',
  2: 'Easy',
  3: 'Average',
  4: 'Difficult',
  5: 'Very difficult',
};

export const GRADES = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'D-',
  'F',
  'Not sure yet',
  'Rather not say',
] as const;
export type Grade = (typeof GRADES)[number];

export const REVIEW_TAGS = [
  'Clear explanations',
  'Tough grader',
  'Lots of homework',
  'Inspirational',
  'Caring',
  'Group projects',
  'Lecture heavy',
  'Accessible outside class',
  'Get ready to read',
  'Amazing lectures',
] as const;
export type ReviewTag = (typeof REVIEW_TAGS)[number];

export const MAX_REVIEW_TAGS = 3;
export const COMMENT_MIN_LENGTH = 20;
export const COMMENT_MAX_LENGTH = 350;

export function isScore(value: unknown): value is Score {
  return SCORES.some((score) => score === value);
}

export function isGrade(value: unknown): value is Grade {
  return GRADES.some((grade) => grade === value);
}

export function isReviewTag(value: unknown): value is ReviewTag {
  return REVIEW_TAGS.some((tag) => tag === value);
}
