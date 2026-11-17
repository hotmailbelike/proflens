/**
 * Counts Unicode code points, the unit firestore.rules measures with size(), so an emoji counts
 * once here instead of as two UTF-16 units and the form agrees with the rules.
 */
export function countCharacters(text: string): number {
  return [...text].length;
}
