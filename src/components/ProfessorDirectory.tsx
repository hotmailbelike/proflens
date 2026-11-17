import { useMemo } from 'react';
import { useHomeFilters } from '../hooks/useHomeFilters';
import { useProfessorStats } from '../hooks/useProfessorStats';
import { filterProfessors } from '../lib/filterProfessors';
import { formatCount } from '../lib/formatters';
import { listUniversities } from '../lib/listUniversities';
import type { Professor } from '../lib/types';
import { ErrorNotice } from './ErrorNotice';
import { ProfessorCard } from './ProfessorCard';
import type { ProfessorStatsStatus } from './ProfessorStatsSummary';
import { SearchField } from './SearchField';
import { UniversityFilter } from './UniversityFilter';

interface ProfessorDirectoryProps {
  professors: Professor[];
}

export function ProfessorDirectory({ professors }: ProfessorDirectoryProps) {
  const universities = useMemo(() => listUniversities(professors), [professors]);
  const [filters, setFilters] = useHomeFilters(universities);
  const { state: statsState, retry: retryStats } = useProfessorStats(professors);
  const results = useMemo(() => filterProfessors(professors, filters), [professors, filters]);

  const statsFor = (professorId: string): ProfessorStatsStatus => {
    if (statsState.status === 'loading') return 'loading';
    if (statsState.status === 'error') return 'unavailable';
    return statsState.data.get(professorId) ?? 'unavailable';
  };

  const clearFilters = () => setFilters({ query: '', university: null });
  const hasFilters = filters.query.trim().length > 0 || filters.university !== null;

  return (
    <section className="directory" aria-labelledby="directory-heading">
      <h2 id="directory-heading" className="visually-hidden">
        Find a professor
      </h2>
      <div className="directory__controls">
        <SearchField value={filters.query} onChange={(query) => setFilters((current) => ({ ...current, query }))} />
        <UniversityFilter
          universities={universities}
          selected={filters.university}
          onChange={(university) => setFilters((current) => ({ ...current, university }))}
        />
      </div>

      <p className="directory__count" role="status">
        {formatCount(results.length, 'professor', 'professors')}
      </p>

      {statsState.status === 'error' && <ErrorNotice message={statsState.message} onRetry={retryStats} />}

      {results.length === 0 ? (
        <div className="empty-state">
          <p>No professors match your search.</p>
          {hasFilters && (
            <button type="button" className="button button--secondary" onClick={clearFilters}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <ul className="professor-list">
          {results.map((professor) => (
            <li key={professor.id}>
              <ProfessorCard professor={professor} stats={statsFor(professor.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
