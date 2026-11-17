import { NavLink } from '../components/NavLink';
import { ProfessorHeader } from '../components/ProfessorHeader';
import { ReviewForm } from '../components/ReviewForm';
import { StatusPanel } from '../components/StatusPanel';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProfessor } from '../hooks/useProfessor';
import { navigate } from '../lib/navigation';
import { markProfessorReviewed } from '../lib/reviewedProfessors';
import { homePath, professorPath } from '../lib/routes';

interface RateProfessorPageProps {
  professorId: string;
}

export function RateProfessorPage({ professorId }: RateProfessorPageProps) {
  const { state, retry } = useProfessor(professorId);
  const professor = state.status === 'ready' ? state.data : null;
  useDocumentTitle(professor === null ? null : `Rate ${professor.name}`);

  if (state.status === 'loading') return <StatusPanel title="Loading professor…" isLoading />;

  if (state.status === 'error') {
    return (
      <StatusPanel title="This professor could not be loaded" tone="error">
        <p className="status-panel__body">{state.message}</p>
        <button type="button" className="button button--secondary" onClick={retry}>
          Try again
        </button>
      </StatusPanel>
    );
  }

  if (professor === null) {
    return (
      <StatusPanel title="Professor not found">
        <p className="status-panel__body">There is no professor to rate at this link.</p>
        <NavLink to={homePath()} className="button button--secondary">
          Browse all professors
        </NavLink>
      </StatusPanel>
    );
  }

  const handlePosted = (reviewId: string) => {
    markProfessorReviewed(professor.id);
    navigate(professorPath(professor.id, reviewId), { replace: true });
  };

  return (
    <div className="rate">
      <NavLink to={professorPath(professor.id)} className="back-link">
        <span aria-hidden="true">←</span> Back to {professor.name}
      </NavLink>
      <ProfessorHeader professor={professor} headingPrefix="Rate" />
      <p className="rate__intro">
        Your review is anonymous and posted as soon as you submit it. Reviews cannot be edited afterwards.
      </p>
      <ReviewForm professor={professor} cancelPath={professorPath(professor.id)} onPosted={handlePosted} />
    </div>
  );
}
