import { formatAverage, formatCount, formatPercent } from '../lib/formatters';
import type { ReviewSummary } from '../lib/summarizeReviews';
import { RatingDistribution } from './RatingDistribution';
import { StatTile } from './StatTile';
import { TagList } from './TagList';

interface ReviewSummaryPanelProps {
  summary: ReviewSummary;
  courses: string[];
}

export function ReviewSummaryPanel({ summary, courses }: ReviewSummaryPanelProps) {
  const hasReviews = summary.reviewCount > 0;

  return (
    <section className="card summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="visually-hidden">
        Rating summary
      </h2>
      <div className="summary__overall">
        <p className="summary__score">
          <span className="summary__score-value">{formatAverage(summary.averageRating)}</span>
          <span className="summary__score-scale">/ 5</span>
        </p>
        <p className="summary__caption">
          Overall quality
          {hasReviews ? ` based on ${formatCount(summary.reviewCount, 'rating', 'ratings')}` : ', no ratings yet'}
        </p>
      </div>

      <dl className="summary__stats">
        <StatTile label="Would take again" value={formatPercent(summary.wouldTakeAgainPercent)} />
        <StatTile label="Level of difficulty" value={formatAverage(summary.averageDifficulty)} />
      </dl>

      {hasReviews && (
        <RatingDistribution distribution={summary.ratingDistribution} reviewCount={summary.reviewCount} />
      )}

      {summary.topTags.length > 0 && (
        <div className="summary__group">
          <h3 className="summary__heading">Top tags</h3>
          <TagList
            label="Top tags"
            tags={summary.topTags.map(({ tag, count }) => ({ label: tag, count }))}
          />
        </div>
      )}

      <div className="summary__group">
        <h3 className="summary__heading">Courses</h3>
        <TagList label="Courses" tags={courses.map((course) => ({ label: course }))} />
      </div>
    </section>
  );
}
