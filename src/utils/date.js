export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function nightsBetween(checkin, checkout) {
  const a = new Date(checkin);
  const b = new Date(checkout);
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}
