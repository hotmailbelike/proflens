import { reviewFieldErrorId, reviewFieldId } from '../lib/reviewFields';
import { MAX_REVIEW_TAGS, REVIEW_TAGS, type ReviewTag } from '../lib/reviewOptions';
import { FieldError } from './FieldError';

interface TagPickerFieldProps {
  value: ReviewTag[];
  onChange: (tags: ReviewTag[]) => void;
  error: string | undefined;
}

const FIELD = 'tags';

/** Optional checkboxes; once the limit is reached the unpicked ones are disabled until one is removed. */
export function TagPickerField({ value, onChange, error }: TagPickerFieldProps) {
  const hintId = `${reviewFieldId(FIELD)}-hint`;
  const errorId = reviewFieldErrorId(FIELD);
  const isAtLimit = value.length >= MAX_REVIEW_TAGS;
  const remaining = MAX_REVIEW_TAGS - value.length;

  const toggle = (tag: ReviewTag) => {
    const isPicked = value.includes(tag);
    onChange(isPicked ? value.filter((picked) => picked !== tag) : [...value, tag]);
  };

  return (
    <fieldset id={reviewFieldId(FIELD)} className="field" aria-describedby={`${hintId} ${errorId}`}>
      <legend className="field__label">
        Tags <span className="field__optional">optional</span>
      </legend>
      <p id={hintId} className="field__hint" aria-live="polite">
        {isAtLimit
          ? `You picked ${MAX_REVIEW_TAGS}. Remove one to choose another.`
          : `Pick up to ${MAX_REVIEW_TAGS} that describe the professor (${remaining} left).`}
      </p>
      <div className="chip-group">
        {REVIEW_TAGS.map((tag) => {
          const isPicked = value.includes(tag);
          return (
            <label key={tag} className="chip">
              <input
                type="checkbox"
                checked={isPicked}
                disabled={!isPicked && isAtLimit}
                onChange={() => toggle(tag)}
              />
              <span>{tag}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
