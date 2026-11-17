import { normalizeSearchText } from './normalizeSearchText';
import type { HomeFilters, Professor } from './types';

const WHITESPACE = /\s+/;

/** Every word typed must appear in the professor's name, department or university. */
export function filterProfessors(professors: Professor[], { query, university }: HomeFilters): Professor[] {
  const terms = normalizeSearchText(query).split(WHITESPACE).filter((term) => term.length > 0);

  return professors.filter((professor) => {
    const isInUniversity = university === null || professor.university === university;
    if (!isInUniversity) return false;

    const searchableText = normalizeSearchText(
      `${professor.name} ${professor.department} ${professor.university}`,
    );
    return terms.every((term) => searchableText.includes(term));
  });
}
