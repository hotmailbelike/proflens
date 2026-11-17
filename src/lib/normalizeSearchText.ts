const COMBINING_MARKS = /[̀-ͯ]/g;

/** Case- and accent-insensitive form, so typing "jose" finds "José". */
export function normalizeSearchText(text: string): string {
  return text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase().trim();
}
