interface UniversityFilterProps {
  universities: string[];
  selected: string | null;
  onChange: (university: string | null) => void;
}

const FILTER_NAME = 'university-filter';
const ALL_UNIVERSITIES = 'All universities';

/** Radio chips: arrow keys move between them and exactly one is always chosen. */
export function UniversityFilter({ universities, selected, onChange }: UniversityFilterProps) {
  const options = [{ value: null, label: ALL_UNIVERSITIES }, ...universities.map((name) => ({ value: name, label: name }))];

  return (
    <fieldset className="chip-group">
      <legend className="visually-hidden">Filter by university</legend>
      {options.map((option) => (
        <label key={option.label} className="chip">
          <input
            type="radio"
            name={FILTER_NAME}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
