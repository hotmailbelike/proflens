interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const SEARCH_INPUT_ID = 'professor-search';

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="search-field">
      <label className="field__label" htmlFor={SEARCH_INPUT_ID}>
        Search professors
      </label>
      <input
        id={SEARCH_INPUT_ID}
        className="input input--search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name, department or university"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
