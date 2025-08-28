export function toStartOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isSameDay(a: Date, b: Date) {
  return toStartOfDay(a).getTime() === toStartOfDay(b).getTime();
}

export function isWithinLastDays(d: Date, days: number) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return d >= cutoff;
}

export type BucketKey = "today" | "thisWeek" | "earlier";

export function bucketForDate(d: Date): BucketKey {
  const now = new Date();
  if (isSameDay(d, now)) return "today";
  if (isWithinLastDays(d, 7)) return "thisWeek";
  return "earlier";
}
