import { formatAverage, formatCount } from '../lib/formatters';
import type { ProfessorStats } from '../lib/types';

export type ProfessorStatsStatus = ProfessorStats | 'loading' | 'unavailable';

interface ProfessorStatsSummaryProps {
  stats: ProfessorStatsStatus;
}

export function ProfessorStatsSummary({ stats }: ProfessorStatsSummaryProps) {
  if (stats === 'loading') {
    return <span className="professor-stats professor-stats--muted">Loading rating…</span>;
  }
  if (stats === 'unavailable') {
    return <span className="professor-stats professor-stats--muted">Rating unavailable</span>;
  }
  if (stats.reviewCount === 0) {
    return <span className="professor-stats professor-stats--muted">No reviews yet</span>;
  }
  return (
    <span className="professor-stats">
      <span className="score-pill">
        <span className="score-pill__value">{formatAverage(stats.averageRating)}</span>
        <span className="score-pill__scale">
          <span aria-hidden="true">/5</span>
          <span className="visually-hidden"> out of 5</span>
        </span>
      </span>
      <span className="professor-stats__count">{formatCount(stats.reviewCount, 'review', 'reviews')}</span>
    </span>
  );
}
