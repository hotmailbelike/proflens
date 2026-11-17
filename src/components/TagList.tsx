import { formatCount } from '../lib/formatters';

interface TagListItem {
  label: string;
  count?: number;
}

interface TagListProps {
  tags: TagListItem[];
  label: string;
}

export function TagList({ tags, label }: TagListProps) {
  return (
    <ul className="tag-list" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag.label} className="tag">
          {tag.label}
          {tag.count !== undefined && (
            <>
              <span className="tag__count" aria-hidden="true">
                {' '}
                ×{tag.count}
              </span>
              <span className="visually-hidden">, {formatCount(tag.count, 'review', 'reviews')}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
