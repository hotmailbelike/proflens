import { useMemo, useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import { hasReviewedProfessor } from '../lib/reviewedProfessors';
import { homePath, ratePath } from '../lib/routes';
import { summarizeReviews } from '../lib/summarizeReviews';
import type { Professor } from '../lib/types';
import { ErrorNotice } from './ErrorNotice';
import { NavLink } from './NavLink';
import { ProfessorHeader } from './ProfessorHeader';
import { ReviewList } from './ReviewList';
import { ReviewSummaryPanel } from './ReviewSummaryPanel';

interface ProfessorProfileProps {
  professor: Professor;
  highlightedReviewId: string | null;
}

export function ProfessorProfile({ professor, highlightedReviewId }: ProfessorProfileProps) {
  const { state: reviewsState, retry } = useReviews(professor.id);
  const [hasReviewed] = useState(() => hasReviewedProfessor(professor.id));
  const summary = useMemo(
    () => (reviewsState.status === 'ready' ? summarizeReviews(reviewsState.data) : null),
    [reviewsState],
  );

  return (
    <div className="profile">
      <NavLink to={homePath()} className="back-link">
        <span aria-hidden="true">←</span> All professors
      </NavLink>

      <ProfessorHeader professor={professor}>
        <NavLink to={ratePath(professor.id)} className="button button--primary">
          Rate this professor
        </NavLink>
        {hasReviewed && <p className="professor-header__note">You've reviewed this professor</p>}
      </ProfessorHeader>

      {reviewsState.status === 'loading' && (
        <div className="inline-loading" role="status" aria-busy="true">
          <span className="spinner" aria-hidden="true" />
          <span>Loading reviews…</span>
        </div>
      )}

      {reviewsState.status === 'error' && <ErrorNotice message={reviewsState.message} onRetry={retry} />}

      {reviewsState.status === 'ready' && summary !== null && (
        <div className="profile__grid">
          <ReviewSummaryPanel summary={summary} courses={professor.courses} />
          {reviewsState.data.length === 0 ? (
            <div className="empty-state">
              <p>No reviews yet. Be the first to share how {professor.name}'s class went.</p>
              <NavLink to={ratePath(professor.id)} className="button button--secondary">
                Write the first review
              </NavLink>
            </div>
          ) : (
            <ReviewList reviews={reviewsState.data} highlightedReviewId={highlightedReviewId} />
          )}
        </div>
      )}
    </div>
  );
}
