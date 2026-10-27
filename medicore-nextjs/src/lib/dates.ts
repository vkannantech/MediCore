/**
 * Date-only columns (@db.Date) are stored as UTC midnight. "Today" must be the
 * calendar date in the clinic's time zone, expressed as that UTC midnight —
 * otherwise users east of UTC (e.g. IST) see yesterday's appointments.
 */
export function todayDateOnly(timeZone = process.env.APP_TIMEZONE) {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatMoney(amount: { toString(): string } | number | null | undefined) {
  return `Rs. ${Number(amount ?? 0).toFixed(2)}`;
}
