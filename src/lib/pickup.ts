const TZ = "Europe/Paris";
const CUTOFF_HOUR = 17;
const CLOSED_WEEKDAYS = [0]; // dimanche

export const PICKUP_TIMES = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

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
  return PICKUP_TIMES.includes(time) && getPickupDates(now, 60).some((d) => d.value === date);
}
