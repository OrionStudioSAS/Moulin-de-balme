/** Jours calendaires « YYYY-MM-DD » calculés à l'heure de Paris (le serveur tourne en UTC) */
export function parisToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine contenant `iso` */
export function weekStart(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7;
  return addDays(iso, -offset);
}

/** Jours d'ouverture (lundi → samedi) de la semaine contenant `iso` */
export function openDaysOfWeek(iso: string): string[] {
  const monday = weekStart(iso);
  return Array.from({ length: 6 }, (_, i) => addDays(monday, i));
}
