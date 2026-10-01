import { fr, type Dict } from "./fr";
import { ja } from "./ja";

export type Locale = "fr" | "ja";
export const LOCALES: Locale[] = ["fr", "ja"];
export const LOCALE_COOKIE = "bo_locale";

const DICTS: Record<Locale, Dict> = { fr, ja };

type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

type BaseKey<K extends string> = K extends `${infer B}_one` ? B : K extends `${infer B}_other` ? B : K;
export type TKey = BaseKey<Leaves<Dict>>;
export type TVars = Record<string, string | number>;
export type TFn = (key: TKey, vars?: TVars) => string;

export function isLocale(v: unknown): v is Locale {
  return v === "fr" || v === "ja";
}

function lookup(dict: Dict, path: string): string | undefined {
  let node: unknown = dict;
  for (const part of path.split(".")) {
    if (node && typeof node === "object" && part in node) node = (node as Record<string, unknown>)[part];
    else return undefined;
  }
  return typeof node === "string" ? node : undefined;
}

export function createT(locale: Locale): TFn {
  const dict = DICTS[locale];
  return (key, vars) => {
    let str: string | undefined;
    if (vars && typeof vars.count === "number") {
      str = lookup(dict, `${key}_${vars.count === 1 ? "one" : "other"}`);
    }
    str ??= lookup(dict, key) ?? lookup(fr, key) ?? key;
    return vars ? str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`)) : str;
  };
}

const INTL: Record<Locale, string> = { fr: "fr-FR", ja: "ja-JP" };

function parseDay(value: string | Date): Date {
  if (value instanceof Date) return value;
  // Les dates « YYYY-MM-DD » sont des jours calendaires : on les lit en UTC pour éviter tout décalage
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function createFormatters(locale: Locale) {
  const loc = INTL[locale];
  const tz = (value: string | Date) => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? "UTC" : "Europe/Paris");
  const jaWithWeekday = (value: string | Date, opts: Intl.DateTimeFormatOptions) => {
    const d = parseDay(value);
    const date = new Intl.DateTimeFormat(loc, { ...opts, timeZone: tz(value) }).format(d);
    const weekday = new Intl.DateTimeFormat(loc, { weekday: "short", timeZone: tz(value) }).format(d);
    return `${date}(${weekday})`;
  };
  return {
    /** « jeu. 1 oct. » / « 10月1日(木) » */
    dateShort: (value: string | Date) =>
      new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "short", timeZone: tz(value) }).format(parseDay(value)),
    /** « Jeudi 1 octobre » / « 10月1日(木) » */
    dateLong: (value: string | Date) =>
      locale === "ja"
        ? jaWithWeekday(value, { month: "long", day: "numeric" })
        : capitalize(new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", timeZone: tz(value) }).format(parseDay(value))),
    /** « Mercredi 30 septembre 2026 » / « 2026年9月30日(水) » */
    dateFull: (value: string | Date) =>
      locale === "ja"
        ? jaWithWeekday(value, { year: "numeric", month: "long", day: "numeric" })
        : capitalize(new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz(value) }).format(parseDay(value))),
    /** « 28 sept. » / « 9月28日 » */
    dayMonth: (value: string | Date) =>
      new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", timeZone: tz(value) }).format(parseDay(value)),
    /** « Lun. 28 » / « 28日(月) » */
    weekdayDay: (value: string | Date) => {
      const d = parseDay(value);
      const opts = { timeZone: tz(value) } as const;
      if (locale === "ja") return `${new Intl.DateTimeFormat(loc, { day: "numeric", ...opts }).format(d)}(${new Intl.DateTimeFormat(loc, { weekday: "short", ...opts }).format(d)})`;
      return capitalize(new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", ...opts }).format(d));
    },
    /** « samedi 3 oct. » / « 10月3日(土) » */
    dateWeekday: (value: string | Date) =>
      locale === "ja"
        ? jaWithWeekday(value, { month: "long", day: "numeric" })
        : new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "short", timeZone: tz(value) }).format(parseDay(value)),
    /** « Lun. » / « 月 » */
    weekdayShort: (value: string | Date) => capitalize(new Intl.DateTimeFormat(loc, { weekday: "short", timeZone: tz(value) }).format(parseDay(value))),
    /** « 30 sept. 2026 » */
    dateMedium: (value: string | Date) =>
      new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", year: "numeric", timeZone: tz(value) }).format(parseDay(value)),
    /** « 8h00 » / « 8:00 » à partir de « 08:00 » */
    time: (value: string) => {
      const [h, m] = value.split(":");
      const hour = String(Number(h));
      return locale === "fr" ? `${hour}h${m}` : `${hour}:${m}`;
    },
    /** « 4,80 € » / « €4.80 » */
    price: (value: number) =>
      new Intl.NumberFormat(loc, { style: "currency", currency: "EUR" }).format(Number(value) || 0),
    number: (value: number) => new Intl.NumberFormat(loc).format(value),
  };
}

export type Formatters = ReturnType<typeof createFormatters>;
