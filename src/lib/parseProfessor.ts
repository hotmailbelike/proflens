import type { DocumentData } from 'firebase/firestore';
import type { Professor } from './types';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Professors are written only by the seed script, but a malformed document is skipped, not rendered. */
export function parseProfessor(id: string, data: DocumentData): Professor | null {
  const { name, initials, university, department, courses } = data;
  const hasValidFields =
    isNonEmptyString(name) &&
    isNonEmptyString(initials) &&
    isNonEmptyString(university) &&
    isNonEmptyString(department) &&
    Array.isArray(courses) &&
    courses.every(isNonEmptyString);
  if (!hasValidFields) {
    console.warn(`Skipping professor ${id}: its document does not have the expected fields.`);
    return null;
  }
  return { id, name, initials, university, department, courses };
}
