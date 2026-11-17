interface FieldErrorProps {
  id: string;
  message: string | undefined;
}

/** Always rendered so aria-describedby never points at a missing element. */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}
