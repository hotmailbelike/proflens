import { useEffect } from 'react';

const APP_NAME = 'ProfLens';

export function useDocumentTitle(pageTitle: string | null): void {
  useEffect(() => {
    document.title = pageTitle === null ? `${APP_NAME} · Professor reviews` : `${pageTitle} · ${APP_NAME}`;
  }, [pageTitle]);
}
