import type { CSSProperties } from 'react';
import { reviewFieldErrorId, reviewFieldId } from '../lib/reviewFields';
import type { ReviewField } from '../lib/types';
import { FieldError } from './FieldError';

export interface SegmentedOption<T> {
  value: T;
  label: string;
  /** Read by screen readers in place of a terse visible label, such as "1, Very easy" for "1". */
  accessibleLabel?: string;
}

interface SegmentedFieldProps<T extends string | number | boolean> {
  field: ReviewField;
  legend: string;
  hint?: string;
  options: SegmentedOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error: string | undefined;
}

/** A required single choice drawn as a segmented control; native radios keep arrow-key support. */
export function SegmentedField<T extends string | number | boolean>({
  field,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
}: SegmentedFieldProps<T>) {
  const hintId = `${reviewFieldId(field)}-hint`;
  const errorId = reviewFieldErrorId(field);

  return (
    <fieldset
      id={reviewFieldId(field)}
      className="field"
      aria-describedby={hint === undefined ? errorId : `${hintId} ${errorId}`}
    >
      <legend className="field__label">{legend}</legend>
      {hint !== undefined && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <div className="segmented" style={{ '--segments': options.length } as CSSProperties}>
        {options.map((option) => (
          <label key={String(option.value)} className="segmented__option">
            <input
              type="radio"
              name={field}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-label={option.accessibleLabel}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
