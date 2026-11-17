import type { Grade, ReviewTag, Score } from './reviewOptions';

export interface Professor {
  id: string;
  name: string;
  initials: string;
  university: string;
  department: string;
  courses: string[];
}

/** A review as the student filled it in, before the server adds its timestamp. */
export interface NewReview {
  course: string;
  rating: Score;
  difficulty: Score;
  wouldTakeAgain: boolean;
  forCredit: boolean;
  textbookUsed: boolean;
  attendanceMandatory: boolean;
  grade: Grade;
  tags: ReviewTag[];
  comment: string;
}

export interface Review extends NewReview {
  id: string;
  createdAt: Date;
}

/** Form state for a review: every answer starts unset so nothing is submitted by default. */
export interface ReviewDraft {
  course: string;
  rating: Score | null;
  difficulty: Score | null;
  wouldTakeAgain: boolean | null;
  forCredit: boolean | null;
  textbookUsed: boolean | null;
  attendanceMandatory: boolean | null;
  grade: Grade | '';
  tags: ReviewTag[];
  comment: string;
}

export type ReviewField = keyof ReviewDraft;

export type ReviewFieldErrors = Partial<Record<ReviewField, string>>;

export interface ProfessorStats {
  reviewCount: number;
  averageRating: number | null;
}

export interface HomeFilters {
  query: string;
  university: string | null;
}
