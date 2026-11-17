interface ProfessorAvatarProps {
  initials: string;
  size?: 'medium' | 'large';
}

/** Initials stand in for photos: every professor here is fictional. */
export function ProfessorAvatar({ initials, size = 'medium' }: ProfessorAvatarProps) {
  return (
    <span className={`avatar avatar--${size}`} aria-hidden="true">
      {initials}
    </span>
  );
}
