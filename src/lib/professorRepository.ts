import { collection, doc, getDoc, getDocsFromServer } from 'firebase/firestore';
import { PROFESSORS_COLLECTION } from './collections';
import { getDb } from './firebase';
import { parseProfessor } from './parseProfessor';
import type { Professor } from './types';

const byName = (first: Professor, second: Professor) => first.name.localeCompare(second.name);

/**
 * Loads every professor. The seeded demo is small enough to search client-side. Read from the server
 * because offline getDocs resolves with an empty cache snapshot, which would read as an empty
 * directory instead of the offline message.
 */
export async function fetchProfessors(): Promise<Professor[]> {
  const snapshot = await getDocsFromServer(collection(getDb(), PROFESSORS_COLLECTION));
  if (snapshot.empty) console.warn('The professors collection is empty. Run `npm run seed` to add the demo data.');
  return snapshot.docs
    .map((professorDoc) => parseProfessor(professorDoc.id, professorDoc.data()))
    .filter((professor): professor is Professor => professor !== null)
    .sort(byName);
}

/** Resolves to null when no professor has this id. */
export async function fetchProfessor(professorId: string): Promise<Professor | null> {
  const snapshot = await getDoc(doc(getDb(), PROFESSORS_COLLECTION, professorId));
  const data = snapshot.data();
  return data === undefined ? null : parseProfessor(snapshot.id, data);
}
