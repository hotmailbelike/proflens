interface CharacterCountProps {
  id: string;
  length: number;
  min: number;
  max: number;
}

const NEAR_LIMIT_RATIO = 0.85;

export function CharacterCount({ id, length, min, max }: CharacterCountProps) {
  const isNearLimit = length >= max * NEAR_LIMIT_RATIO;
  const missing = min - length;
  return (
    <span id={id} className={`char-count${isNearLimit ? ' char-count--near' : ''}`}>
      {length}/{max}
      {missing > 0 && ` · ${missing} more needed`}
    </span>
  );
}
