import { countCharacters } from '../lib/countCharacters';
import { reviewFieldErrorId, reviewFieldId } from '../lib/reviewFields';
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH } from '../lib/reviewOptions';
import { CharacterCount } from './CharacterCount';
import { FieldError } from './FieldError';

interface CommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
}

const FIELD = 'comment';
const TEXTAREA_ROWS = 6;

export function CommentField({ value, onChange, error }: CommentFieldProps) {
  const id = reviewFieldId(FIELD);
  const hintId = `${id}-hint`;
  const countId = `${id}-count`;
  const errorId = reviewFieldErrorId(FIELD);

  return (
    <div className="field">
      <div className="field__label-row">
        <label className="field__label" htmlFor={id}>
          Write a review
        </label>
        <CharacterCount
          id={countId}
          length={countCharacters(value.trim())}
          min={COMMENT_MIN_LENGTH}
          max={COMMENT_MAX_LENGTH}
        />
      </div>
      <p id={hintId} className="field__hint">
        {COMMENT_MIN_LENGTH} to {COMMENT_MAX_LENGTH} characters. Talk about the teaching and the course, and keep it
        respectful.
      </p>
      <textarea
        id={id}
        className="input textarea"
        rows={TEXTAREA_ROWS}
        value={value}
        maxLength={COMMENT_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={`${hintId} ${countId} ${errorId}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
