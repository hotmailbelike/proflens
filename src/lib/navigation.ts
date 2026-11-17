const NAVIGATION_EVENT = 'proflens:navigate';

export const currentLocation = () => `${window.location.pathname}${window.location.search}`;

interface NavigateOptions {
  /** Replace the current history entry, so Back skips the page being left (such as a submitted form). */
  replace?: boolean;
}

/** Client-side navigation without a router dependency; the app only has three views. */
export function navigate(path: string, { replace = false }: NavigateOptions = {}): void {
  if (path === currentLocation()) return;
  if (replace) {
    window.history.replaceState(null, '', path);
  } else {
    window.history.pushState(null, '', path);
  }
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

export function subscribeToNavigation(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAVIGATION_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAVIGATION_EVENT, onChange);
  };
}
