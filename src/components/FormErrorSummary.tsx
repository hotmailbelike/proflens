import type { MouseEvent, RefObject } from 'react';
import { REVIEW_FIELD_ORDER, reviewFieldId } from '../lib/reviewFields';
import type { ReviewField, ReviewFieldErrors } from '../lib/types';

interface FormErrorSummaryProps {
  errors: ReviewFieldErrors;
  summaryRef: RefObject<HTMLDivElement | null>;
}

const FOCUSABLE_CONTROL = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

/** Each link moves focus to the field's first control; a plain #hash link would only scroll. */
function focusField(event: MouseEvent<HTMLAnchorElement>, field: ReviewField) {
  const fieldElement = document.getElementById(reviewFieldId(field));
  const control = fieldElement?.matches(FOCUSABLE_CONTROL)
    ? fieldElement
    : fieldElement?.querySelector<HTMLElement>(FOCUSABLE_CONTROL);
  if (!control) return;
  event.preventDefault();
  control.focus();
}

export function FormErrorSummary({ errors, summaryRef }: FormErrorSummaryProps) {
  const fieldsWithErrors = REVIEW_FIELD_ORDER.filter((field) => errors[field] !== undefined);
  if (fieldsWithErrors.length === 0) return null;

  return (
    <div ref={summaryRef} className="error-summary" tabIndex={-1} role="alert" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title" className="error-summary__title">
        Please fix {fieldsWithErrors.length === 1 ? 'this answer' : 'these answers'}
      </h2>
      <ul>
        {fieldsWithErrors.map((field) => (
          <li key={field}>
            <a href={`#${reviewFieldId(field)}`} onClick={(event) => focusField(event, field)}>
              {errors[field]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
