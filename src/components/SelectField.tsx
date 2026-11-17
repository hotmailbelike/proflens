import { reviewFieldErrorId, reviewFieldId } from '../lib/reviewFields';
import type { ReviewField } from '../lib/types';
import { FieldError } from './FieldError';

interface SelectFieldProps<T extends string> {
  field: ReviewField;
  label: string;
  placeholder: string;
  options: readonly T[];
  value: T | '';
  onChange: (value: T | '') => void;
  error: string | undefined;
}

export function SelectField<T extends string>({
  field,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps<T>) {
  const id = reviewFieldId(field);
  const errorId = reviewFieldErrorId(field);

  const handleChange = (selected: string) => {
    const option = options.find((candidate) => candidate === selected);
    onChange(option ?? '');
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="input select"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={errorId}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
