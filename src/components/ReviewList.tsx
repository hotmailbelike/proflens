import { useRef } from 'react';
import { useFocusOnceReady } from '../hooks/useFocusOnceReady';
import { formatCount } from '../lib/formatters';
import type { Review } from '../lib/types';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  highlightedReviewId: string | null;
}

export function ReviewList({ reviews, highlightedReviewId }: ReviewListProps) {
  const highlightedRef = useRef<HTMLElement>(null);
  const hasHighlightedReview = reviews.some((review) => review.id === highlightedReviewId);
  useFocusOnceReady(highlightedRef, hasHighlightedReview);

  return (
    <section className="reviews" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="section-heading">
        Student reviews <span className="section-heading__count">{formatCount(reviews.length, 'review', 'reviews')}</span>
      </h2>
      {hasHighlightedReview && (
        <p className="notice notice--success" role="status">
          Thanks! Your review is posted.
        </p>
      )}
      <ol className="review-list">
        {reviews.map((review) => {
          const isHighlighted = review.id === highlightedReviewId;
          return (
            <li key={review.id}>
              <ReviewCard review={review} isHighlighted={isHighlighted} ref={isHighlighted ? highlightedRef : undefined} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
