import { useRef } from 'react';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { NotConfigured } from './components/NotConfigured';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { useFocusOnRouteChange } from './hooks/useFocusOnRouteChange';
import { useRoute } from './hooks/useRoute';
import { isFirebaseConfigured } from './lib/firebase';
import { routeKey, type Route } from './lib/routes';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfessorPage } from './pages/ProfessorPage';
import { RateProfessorPage } from './pages/RateProfessorPage';

function renderRoute(route: Route) {
  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'professor':
      // Keyed so moving between professors starts from a clean state.
      return (
        <ProfessorPage
          key={route.professorId}
          professorId={route.professorId}
          highlightedReviewId={route.highlightedReviewId}
        />
      );
    case 'rate':
      return <RateProfessorPage key={route.professorId} professorId={route.professorId} />;
    case 'not-found':
      return <NotFoundPage />;
  }
}

export function App() {
  const route = useRoute();
  const currentRouteKey = routeKey(route);
  const mainRef = useRef<HTMLElement>(null);
  useFocusOnRouteChange(currentRouteKey, mainRef);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader />
      <main id="main" ref={mainRef} tabIndex={-1} className="app-main">
        {isFirebaseConfigured ? (
          <RouteErrorBoundary key={currentRouteKey}>{renderRoute(route)}</RouteErrorBoundary>
        ) : (
          <NotConfigured />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
