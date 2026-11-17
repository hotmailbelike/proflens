import type { Ref } from 'react';
import { formatReviewDate, formatYesNo } from '../lib/formatters';
import { DIFFICULTY_LABELS, RATING_LABELS } from '../lib/reviewOptions';
import type { Review } from '../lib/types';
import { TagList } from './TagList';

interface ReviewCardProps {
  review: Review;
  isHighlighted: boolean;
  ref?: Ref<HTMLElement>;
}

export function ReviewCard({ review, isHighlighted, ref }: ReviewCardProps) {
  const details = [
    { label: 'For credit', value: formatYesNo(review.forCredit) },
    { label: 'Attendance mandatory', value: formatYesNo(review.attendanceMandatory) },
    { label: 'Would take again', value: formatYesNo(review.wouldTakeAgain) },
    { label: 'Textbook used', value: formatYesNo(review.textbookUsed) },
    { label: 'Grade', value: review.grade },
  ];

  return (
    <article
      ref={ref}
      className={`card review${isHighlighted ? ' review--highlighted' : ''}`}
      tabIndex={isHighlighted ? -1 : undefined}
      aria-label={isHighlighted ? `Your review of ${review.course}` : undefined}
    >
      <div className="review__scores">
        <p className="score-box">
          <span className="score-box__label">Quality</span>
          <span className="score-box__value">{review.rating}</span>
          <span className="visually-hidden">out of 5, {RATING_LABELS[review.rating]}</span>
        </p>
        <p className="score-box score-box--quiet">
          <span className="score-box__label">Difficulty</span>
          <span className="score-box__value">{review.difficulty}</span>
          <span className="visually-hidden">out of 5, {DIFFICULTY_LABELS[review.difficulty]}</span>
        </p>
      </div>

      <div className="review__body">
        <header className="review__header">
          <h3 className="review__course">{review.course}</h3>
          {isHighlighted && <span className="review__badge">Your review</span>}
          <time className="review__date" dateTime={review.createdAt.toISOString()}>
            {formatReviewDate(review.createdAt)}
          </time>
        </header>

        <dl className="review__details">
          {details.map((detail) => (
            <div key={detail.label} className="review__detail">
              <dt>{detail.label}:</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>

        <p className="review__comment">{review.comment}</p>

        {review.tags.length > 0 && <TagList label="Tags" tags={review.tags.map((tag) => ({ label: tag }))} />}
      </div>
    </article>
  );
}
