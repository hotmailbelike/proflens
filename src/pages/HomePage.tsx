import { ProfessorDirectory } from '../components/ProfessorDirectory';
import { StatusPanel } from '../components/StatusPanel';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProfessors } from '../hooks/useProfessors';

export function HomePage() {
  useDocumentTitle(null);
  const { state, retry } = useProfessors();

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero__title">
          Prof<span className="hero__accent">Lens</span>
        </h1>
        <p className="hero__lede">Honest reviews of university professors, from students.</p>
      </section>

      {state.status === 'loading' && <StatusPanel title="Loading professors…" isLoading headingLevel="h2" />}

      {state.status === 'error' && (
        <StatusPanel title="Professors could not be loaded" tone="error" headingLevel="h2">
          <p className="status-panel__body">{state.message}</p>
          <button type="button" className="button button--secondary" onClick={retry}>
            Try again
          </button>
        </StatusPanel>
      )}

      {state.status === 'ready' &&
        (state.data.length === 0 ? (
          <StatusPanel title="No professors to show yet" headingLevel="h2">
            <p className="status-panel__body">Check back soon.</p>
          </StatusPanel>
        ) : (
          <ProfessorDirectory professors={state.data} />
        ))}
    </div>
  );
}
