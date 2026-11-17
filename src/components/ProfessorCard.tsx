import { professorPath } from '../lib/routes';
import type { Professor } from '../lib/types';
import { NavLink } from './NavLink';
import { ProfessorAvatar } from './ProfessorAvatar';
import { ProfessorStatsSummary, type ProfessorStatsStatus } from './ProfessorStatsSummary';

interface ProfessorCardProps {
  professor: Professor;
  stats: ProfessorStatsStatus;
}

export function ProfessorCard({ professor, stats }: ProfessorCardProps) {
  return (
    <article className="card professor-card">
      <ProfessorAvatar initials={professor.initials} />
      <div className="professor-card__body">
        <h3 className="professor-card__name">
          {/* The link's ::after covers the whole card, so the card is one large target. */}
          <NavLink to={professorPath(professor.id)} className="professor-card__link">
            {professor.name}
          </NavLink>
        </h3>
        <p className="professor-card__meta">
          {professor.department} · {professor.university}
        </p>
      </div>
      <ProfessorStatsSummary stats={stats} />
    </article>
  );
}
