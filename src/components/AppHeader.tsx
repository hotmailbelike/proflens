import { NavLink } from './NavLink';
import { homePath } from '../lib/routes';

export function AppHeader() {
  return (
    <header className="app-header">
      <NavLink to={homePath()} className="brand" aria-label="ProfLens home">
        <span className="brand__mark" aria-hidden="true" />
        <span className="brand__name">ProfLens</span>
      </NavLink>
    </header>
  );
}
