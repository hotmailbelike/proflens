import type { ReactNode } from 'react';

interface StatusPanelProps {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
  tone?: 'neutral' | 'error';
  /** h1 when the panel is the whole page; h2 when the page already has its own h1. */
  headingLevel?: 'h1' | 'h2';
}

/** Shared loading, empty and error states. */
export function StatusPanel({
  title,
  children,
  isLoading = false,
  tone = 'neutral',
  headingLevel: Heading = 'h1',
}: StatusPanelProps) {
  return (
    <section
      className={`status-panel status-panel--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-busy={isLoading}
    >
      {isLoading && <span className="spinner" aria-hidden="true" />}
      <Heading className="status-panel__title">{title}</Heading>
      {children}
    </section>
  );
}
