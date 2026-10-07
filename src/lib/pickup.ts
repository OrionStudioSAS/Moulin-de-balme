const TZ = "Europe/Paris";
/** Heure limite pour commander et retirer dès le lendemain */
export const CUTOFF_HOUR = 14;
const CLOSED_WEEKDAYS = [0]; // dimanche
const SATURDAY = 6;

const slots = (from: string, to: string) => {
  const out: string[] = [];
  for (let m = toMinutes(from); m <= toMinutes(to); m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
};
function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Boutique : fermeture 17h30 en semaine, 12h30 le samedi → dernier créneau une demi-heure avant */
export const PICKUP_TIMES = slots("07:00", "17:00");
const SATURDAY_PICKUP_TIMES = slots("07:00", "12:00");

export function pickupTimesFor(date: string): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return PICKUP_TIMES;
  return new Date(`${date}T00:00:00Z`).getUTCDay() === SATURDAY ? SATURDAY_PICKUP_TIMES : PICKUP_TIMES;
}

export type PickupDate = { value: string; label: string };

function parisNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") };
}

const labelFormat = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function getPickupDates(now = new Date(), count = 14): PickupDate[] {
  const { year, month, day, hour } = parisNow(now);
  let offset = hour >= CUTOFF_HOUR ? 2 : 1;
  const dates: PickupDate[] = [];

  while (dates.length < count) {
    const d = new Date(Date.UTC(year, month - 1, day + offset));
    offset++;
    if (CLOSED_WEEKDAYS.includes(d.getUTCDay())) continue;
    const label = labelFormat.format(d);
    dates.push({
      value: d.toISOString().slice(0, 10),
      label: label.charAt(0).toUpperCase() + label.slice(1),
    });
  }
  return dates;
}

export function isValidPickup(date: string, time: string, now = new Date()) {
  return pickupTimesFor(date).includes(time) && getPickupDates(now, 60).some((d) => d.value === date);
}

/** Secondes avant la prochaine heure limite (heure locale du navigateur, en France) */
export function secondsUntilCutoff(now = new Date()) {
  const target = new Date(now);
  target.setHours(CUTOFF_HOUR, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  return Math.floor((target.getTime() - now.getTime()) / 1000);
}
