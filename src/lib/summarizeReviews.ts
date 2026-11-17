import { SCORES, type ReviewTag, type Score } from './reviewOptions';
import type { Review } from './types';

const TOP_TAG_LIMIT = 5;
const PERCENT = 100;

export interface ScoreCount {
  score: Score;
  count: number;
}

export interface TagCount {
  tag: ReviewTag;
  count: number;
}

export interface ReviewSummary {
  reviewCount: number;
  /** Null until there is at least one review. */
  averageRating: number | null;
  averageDifficulty: number | null;
  wouldTakeAgainPercent: number | null;
  /** Highest score first, with a zero count for scores nobody gave. */
  ratingDistribution: ScoreCount[];
  topTags: TagCount[];
}

function averageOf(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function countRatings(reviews: Review[]): ScoreCount[] {
  const highestFirst = [...SCORES].reverse();
  return highestFirst.map((score) => ({
    score,
    count: reviews.filter((review) => review.rating === score).length,
  }));
}

function countTopTags(reviews: Review[]): TagCount[] {
  const counts = new Map<ReviewTag, number>();
  for (const tag of reviews.flatMap((review) => review.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((first, second) => second.count - first.count || first.tag.localeCompare(second.tag))
    .slice(0, TOP_TAG_LIMIT);
}

/** Aggregated in the browser from the reviews already loaded for the page; see the README trade-off note. */
export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const wouldTakeAgainShare = averageOf(reviews.map((review) => (review.wouldTakeAgain ? 1 : 0)));
  return {
    reviewCount: reviews.length,
    averageRating: averageOf(reviews.map((review) => review.rating)),
    averageDifficulty: averageOf(reviews.map((review) => review.difficulty)),
    wouldTakeAgainPercent: wouldTakeAgainShare === null ? null : Math.round(wouldTakeAgainShare * PERCENT),
    ratingDistribution: countRatings(reviews),
    topTags: countTopTags(reviews),
  };
}
