import type { CSSProperties } from 'react';
import { RATING_LABELS } from '../lib/reviewOptions';
import type { ScoreCount } from '../lib/summarizeReviews';

interface RatingDistributionProps {
  distribution: ScoreCount[];
  reviewCount: number;
}

/** One bar per score; the visible counts carry the meaning and the bars only illustrate them. */
export function RatingDistribution({ distribution, reviewCount }: RatingDistributionProps) {
  return (
    <ul className="distribution" aria-label="Rating distribution">
      {distribution.map(({ score, count }) => {
        const share = reviewCount === 0 ? 0 : count / reviewCount;
        return (
          <li key={score} className="distribution__row">
            <span className="distribution__label">
              {RATING_LABELS[score]} <span className="distribution__score">{score}</span>
            </span>
            <span className="distribution__track" aria-hidden="true">
              <span className="distribution__fill" style={{ '--fill': share } as CSSProperties} />
            </span>
            <span className="distribution__count">
              {count}
              <span className="visually-hidden">{count === 1 ? ' review' : ' reviews'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
