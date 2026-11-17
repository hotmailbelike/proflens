import type { Professor } from './types';

export function listUniversities(professors: Professor[]): string[] {
  const universities = new Set(professors.map((professor) => professor.university));
  return [...universities].sort((first, second) => first.localeCompare(second));
}
