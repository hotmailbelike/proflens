import { NavLink } from '../components/NavLink';
import { ProfessorProfile } from '../components/ProfessorProfile';
import { StatusPanel } from '../components/StatusPanel';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useHighlightOnce } from '../hooks/useHighlightOnce';
import { useProfessor } from '../hooks/useProfessor';
import { homePath } from '../lib/routes';

interface ProfessorPageProps {
  professorId: string;
  highlightedReviewId: string | null;
}

export function ProfessorPage({ professorId, highlightedReviewId: highlightFromUrl }: ProfessorPageProps) {
  const highlightedReviewId = useHighlightOnce(professorId, highlightFromUrl);
  const { state, retry } = useProfessor(professorId);
  const professor = state.status === 'ready' ? state.data : null;
  useDocumentTitle(professor?.name ?? null);

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
        <p className="status-panel__body">This link does not match any professor. They may have been renamed.</p>
        <NavLink to={homePath()} className="button button--secondary">
          Browse all professors
        </NavLink>
      </StatusPanel>
    );
  }

  return <ProfessorProfile professor={professor} highlightedReviewId={highlightedReviewId} />;
}
