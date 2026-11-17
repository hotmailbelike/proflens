import type { ReactNode } from 'react';
import type { Professor } from '../lib/types';
import { ProfessorAvatar } from './ProfessorAvatar';

interface ProfessorHeaderProps {
  professor: Professor;
  /** Optional heading prefix, such as "Rate" on the review form. */
  headingPrefix?: string;
  children?: ReactNode;
}

export function ProfessorHeader({ professor, headingPrefix, children }: ProfessorHeaderProps) {
  return (
    <header className="professor-header">
      <ProfessorAvatar initials={professor.initials} size="large" />
      <div className="professor-header__text">
        <h1 className="professor-header__name">
          {headingPrefix !== undefined && <span className="professor-header__prefix">{headingPrefix} </span>}
          {professor.name}
        </h1>
        <p className="professor-header__meta">
          {professor.department} · {professor.university}
        </p>
      </div>
      {children !== undefined && <div className="professor-header__actions">{children}</div>}
    </header>
  );
}
