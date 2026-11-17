import { reviewFieldErrorId, reviewFieldId } from '../lib/reviewFields';
import { RATING_LABELS, SCORES, type Score } from '../lib/reviewOptions';
import { FieldError } from './FieldError';
import { StarIcon } from './StarIcon';

interface StarRatingFieldProps {
  value: Score | null;
  onChange: (score: Score) => void;
  error: string | undefined;
}

const FIELD = 'rating';
const MAX_SCORE = SCORES[SCORES.length - 1];

/** Five radios drawn as stars; every star up to the chosen score is filled. */
export function StarRatingField({ value, onChange, error }: StarRatingFieldProps) {
  const errorId = reviewFieldErrorId(FIELD);

  return (
    <fieldset id={reviewFieldId(FIELD)} className="field" aria-describedby={errorId}>
      <legend className="field__label">Rate your professor</legend>
      <div className="stars">
        {SCORES.map((score) => {
          const isFilled = value !== null && score <= value;
          return (
            <label key={score} className={`star${isFilled ? ' star--filled' : ''}`}>
              <input
                type="radio"
                name={FIELD}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
                aria-label={`${score} of ${MAX_SCORE}, ${RATING_LABELS[score]}`}
              />
              <StarIcon />
            </label>
          );
        })}
        <span className="stars__caption" aria-hidden="true">
          {value === null ? 'Choose 1 to 5 stars' : `${value}/${MAX_SCORE} · ${RATING_LABELS[value]}`}
        </span>
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
