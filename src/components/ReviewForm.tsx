import { useMemo, useRef, useState, type FormEvent } from 'react';
import { useSubmitReview } from '../hooks/useSubmitReview';
import { EMPTY_REVIEW_DRAFT } from '../lib/reviewFields';
import { DIFFICULTY_LABELS, GRADES, SCORES, type Score } from '../lib/reviewOptions';
import type { Professor, ReviewDraft } from '../lib/types';
import { validateReviewDraft } from '../lib/validateReviewDraft';
import { CommentField } from './CommentField';
import { FormErrorSummary } from './FormErrorSummary';
import { NavLink } from './NavLink';
import { SegmentedField, type SegmentedOption } from './SegmentedField';
import { SelectField } from './SelectField';
import { StarRatingField } from './StarRatingField';
import { TagPickerField } from './TagPickerField';

interface ReviewFormProps {
  professor: Professor;
  cancelPath: string;
  onPosted: (reviewId: string) => void;
}

const YES_NO_OPTIONS: SegmentedOption<boolean>[] = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const DIFFICULTY_OPTIONS: SegmentedOption<Score>[] = SCORES.map((score) => ({
  value: score,
  label: String(score),
  accessibleLabel: `${score}, ${DIFFICULTY_LABELS[score]}`,
}));

const YES_NO_QUESTIONS = [
  { field: 'wouldTakeAgain', legend: 'Would you take this professor again?' },
  { field: 'forCredit', legend: 'Was this class taken for credit?' },
  { field: 'textbookUsed', legend: 'Did this professor use a textbook?' },
  { field: 'attendanceMandatory', legend: 'Was attendance mandatory?' },
] as const;

export function ReviewForm({ professor, cancelPath, onPosted }: ReviewFormProps) {
  const [draft, setDraft] = useState<ReviewDraft>(EMPTY_REVIEW_DRAFT);
  // Errors appear after the first submit attempt, then update as the student fixes each answer.
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const { state: submitState, submit } = useSubmitReview(professor.id);

  const validation = useMemo(() => validateReviewDraft(draft, professor.courses), [draft, professor.courses]);
  const errors = hasAttemptedSubmit && !validation.isValid ? validation.errors : {};
  const isSubmitting = submitState.status === 'submitting';

  const update = <Field extends keyof ReviewDraft>(field: Field, value: ReviewDraft[Field]) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validation.isValid) {
      // Wait for the summary to render before moving focus to it.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    const reviewId = await submit(validation.review);
    if (reviewId !== null) onPosted(reviewId);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <FormErrorSummary errors={errors} summaryRef={errorSummaryRef} />

      <fieldset className="review-form__fields" disabled={isSubmitting}>
        <legend className="visually-hidden">Your review of {professor.name}</legend>

        <div className="card review-form__section">
          <SelectField
            field="course"
            label="Course"
            placeholder="Select a course"
            options={professor.courses}
            value={draft.course}
            onChange={(course) => update('course', course)}
            error={errors.course}
          />
          <StarRatingField value={draft.rating} onChange={(rating) => update('rating', rating)} error={errors.rating} />
          <SegmentedField
            field="difficulty"
            legend="How difficult was this professor?"
            hint="1 is very easy, 5 is very difficult."
            options={DIFFICULTY_OPTIONS}
            value={draft.difficulty}
            onChange={(difficulty) => update('difficulty', difficulty)}
            error={errors.difficulty}
          />
        </div>

        <div className="card review-form__section review-form__section--grid">
          {YES_NO_QUESTIONS.map(({ field, legend }) => (
            <SegmentedField
              key={field}
              field={field}
              legend={legend}
              options={YES_NO_OPTIONS}
              value={draft[field]}
              onChange={(answer) => update(field, answer)}
              error={errors[field]}
            />
          ))}
          <SelectField
            field="grade"
            label="Grade received"
            placeholder="Select a grade"
            options={GRADES}
            value={draft.grade}
            onChange={(grade) => update('grade', grade)}
            error={errors.grade}
          />
        </div>

        <div className="card review-form__section">
          <TagPickerField value={draft.tags} onChange={(tags) => update('tags', tags)} error={errors.tags} />
          <CommentField value={draft.comment} onChange={(comment) => update('comment', comment)} error={errors.comment} />
        </div>
      </fieldset>

      {submitState.status === 'error' && (
        <p className="notice notice--error" role="alert">
          {submitState.message}
        </p>
      )}

      <div className="review-form__actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Posting…' : 'Post review'}
        </button>
        <NavLink to={cancelPath} className="button button--ghost">
          Cancel
        </NavLink>
      </div>
    </form>
  );
}
