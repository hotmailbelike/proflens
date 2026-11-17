const AVERAGE_DECIMALS = 1;
const NO_VALUE = '–';

const reviewDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** One decimal, as students expect from a five-point average. */
export function formatAverage(average: number | null): string {
  return average === null ? NO_VALUE : average.toFixed(AVERAGE_DECIMALS);
}

export function formatPercent(percent: number | null): string {
  return percent === null ? NO_VALUE : `${percent}%`;
}

export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatReviewDate(date: Date): string {
  return reviewDateFormat.format(date);
}

export function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}
