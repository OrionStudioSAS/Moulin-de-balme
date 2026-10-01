"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { addDays } from "@/lib/bo/dates";
import { Button } from "@/components/bo/ui/Button";

/** Jours de vente : pastilles des dates à venir + calendrier à sélection multiple */
export function DatesField({ value, onChange, today, emptyHint }: { value: string[]; onChange: (dates: string[]) => void; today: string; emptyHint?: string }) {
  const { t, fmt, locale } = useBoI18n();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(today.slice(0, 7));

  const upcoming = value.filter((d) => d >= today).sort();
  const toggle = (iso: string) => onChange(value.includes(iso) ? value.filter((d) => d !== iso) : [...value, iso].sort());

  const days = useMemo(() => {
    const first = `${month}-01`;
    const start = new Date(`${first}T00:00:00Z`);
    const offset = (start.getUTCDay() + 6) % 7; // lundi en premier
    const cells: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let d = first; d.startsWith(month); d = addDays(d, 1)) cells.push(d);
    return cells;
  }, [month]);

  const shiftMonth = (n: number) => {
    const d = new Date(`${month}-01T00:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() + n);
    setMonth(d.toISOString().slice(0, 7));
  };

  const monthLabel = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "fr-FR", { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i)))
  );

  return (
    <div className="flex flex-col gap-3">
      {upcoming.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {upcoming.map((d) => (
            <span key={d} className="inline-flex h-7 items-center gap-1 rounded-full border border-bo-line-strong bg-bo-subtle pl-2.5 pr-1 text-bo-small font-medium text-bo-ink">
              {fmt.dateShort(d).charAt(0).toUpperCase() + fmt.dateShort(d).slice(1)}
              <button type="button" onClick={() => toggle(d)} aria-label={t("form.removeDate", { date: fmt.dateLong(d) })} className="rounded-full p-0.5 text-bo-icon hover:bg-bo-muted hover:text-bo-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        emptyHint && <p className="text-bo-small text-bo-ink-3">{emptyHint}</p>
      )}

      {!open ? (
        <Button variant="secondary" icon={<Calendar className="h-4 w-4" />} onClick={() => setOpen(true)} className="w-full">
          {t("form.addDates")}
        </Button>
      ) : (
        <div className="rounded-bo-md border border-bo-line-strong p-3">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} disabled={month <= today.slice(0, 7)} aria-label={t("form.prevMonth")} className="rounded-bo-sm p-1.5 text-bo-icon hover:bg-bo-subtle disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-bo-body font-semibold capitalize text-bo-ink">{monthLabel}</span>
            <button type="button" onClick={() => shiftMonth(1)} aria-label={t("form.nextMonth")} className="rounded-bo-sm p-1.5 text-bo-icon hover:bg-bo-subtle">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {weekdays.map((w, i) => (
              <span key={i} className="py-1 text-bo-caption text-bo-ink-3">
                {w}
              </span>
            ))}
            {days.map((d, i) =>
              d ? (
                <button
                  key={d}
                  type="button"
                  disabled={d < today}
                  aria-pressed={value.includes(d)}
                  onClick={() => toggle(d)}
                  className={cn(
                    "h-9 rounded-bo-sm text-bo-small tabular-nums transition-colors disabled:text-bo-ink-disabled",
                    value.includes(d) ? "bg-bo-primary font-semibold text-bo-ink-inverse" : "text-bo-ink hover:bg-bo-subtle",
                    d === today && !value.includes(d) && "font-semibold ring-1 ring-inset ring-bo-line-strong"
                  )}
                >
                  {Number(d.slice(8))}
                </button>
              ) : (
                <span key={`e${i}`} />
              )
            )}
          </div>
          <Button variant="primary" onClick={() => setOpen(false)} className="mt-3 w-full">
            {t("form.done")}
          </Button>
        </div>
      )}
    </div>
  );
}
