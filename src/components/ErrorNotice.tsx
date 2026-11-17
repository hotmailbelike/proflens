interface ErrorNoticeProps {
  message: string;
  onRetry: () => void;
}

/** An inline error with a retry, for reviews or ratings that failed to load. */
export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <div className="notice notice--error notice--with-action" role="alert">
      <p>{message}</p>
      <button type="button" className="button button--secondary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
