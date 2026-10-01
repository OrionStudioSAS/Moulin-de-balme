"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, Lock, Plus, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { addDays, openDaysOfWeek } from "@/lib/bo/dates";
import { Button } from "@/components/bo/ui/Button";
import { Checkbox, Toggle } from "@/components/bo/ui/Controls";
import { Card, EmptyState, PageHeader, Thumb } from "@/components/bo/ui/Display";
import { Input } from "@/components/bo/ui/Field";
import { useToast } from "@/components/bo/ui/Toast";

export type WeekProduct = {
  id: string;
  name: string;
  image_url: string | null;
  available_days: string[];
  is_semaine: boolean;
  category?: { name: string } | null;
};

/** Produit « toute la semaine » : marqué Cette semaine sans date précise (règle du site public) */
const isAllWeek = (p: WeekProduct) => p.is_semaine && (!p.available_days || p.available_days.length === 0);

export default function WeekView({ products: initial, today, monday }: { products: WeekProduct[]; today: string; monday: string }) {
  const { t, fmt } = useBoI18n();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [products, setProducts] = useState(initial);
  const [added, setAdded] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileDay, setMobileDay] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setProducts(initial), [initial]);
  useEffect(() => setAdded([]), [monday]);

  const days = openDaysOfWeek(monday);
  const thisMonday = openDaysOfWeek(today)[0];
  const selectedDay = mobileDay && days.includes(mobileDay) ? mobileDay : days.includes(today) ? today : days[0];

  const inWeek = (p: WeekProduct) => isAllWeek(p) || p.available_days?.some((d) => days.includes(d)) || added.includes(p.id);
  const rows = products.filter(inWeek).sort((a, b) => a.name.localeCompare(b.name));
  const checked = (p: WeekProduct, day: string) => isAllWeek(p) || p.available_days.includes(day);
  const countFor = (day: string) => rows.filter((p) => checked(p, day)).length;

  const goWeek = (m: string) => router.replace(m === thisMonday ? pathname : `${pathname}?semaine=${m}`, { scroll: false });

  const persist = async (product: WeekProduct, next: Partial<WeekProduct>, previous: WeekProduct) => {
    setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, ...next } : p)));
    const { error } = await createClient()
      .from("products")
      .update({ available_days: next.available_days, is_semaine: next.is_semaine })
      .eq("id", product.id);
    if (error) {
      setProducts((list) => list.map((p) => (p.id === product.id ? previous : p)));
      toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: () => persist(product, next, previous) });
      return false;
    }
    router.refresh();
    return true;
  };

  const toggleDay = async (product: WeekProduct, day: string, value: boolean) => {
    // Un produit « toute la semaine » est converti en dates explicites pour la semaine affichée
    const base = isAllWeek(product) ? days.filter((d) => d >= today) : product.available_days;
    const nextDays = (value ? (base.includes(day) ? base : [...base, day]) : base.filter((d) => d !== day)).sort();
    const next = { available_days: nextDays, is_semaine: nextDays.length > 0 || product.is_semaine };
    const ok = await persist(product, next, product);
    if (!ok) return;
    toast({
      tone: "success",
      message: t(value ? "week.proposedOn" : "week.removedOn", { name: product.name, date: fmt.dateWeekday(day) }),
      actionLabel: t("common.undo"),
      onAction: () => persist({ ...product, ...next }, { available_days: product.available_days, is_semaine: product.is_semaine }, { ...product, ...next }),
    });
  };

  const removeRow = async (product: WeekProduct) => {
    if (!product.is_semaine && !product.available_days.some((d) => days.includes(d))) {
      setAdded((a) => a.filter((id) => id !== product.id));
      return;
    }
    const remaining = isAllWeek(product) ? [] : product.available_days.filter((d) => !days.includes(d));
    const next = { available_days: remaining, is_semaine: remaining.length > 0 };
    setAdded((a) => a.filter((id) => id !== product.id));
    const ok = await persist(product, next, product);
    if (!ok) return;
    toast({
      tone: "success",
      message: t("week.removedWeek", { name: product.name }),
      actionLabel: t("common.undo"),
      onAction: () => persist({ ...product, ...next }, { available_days: product.available_days, is_semaine: product.is_semaine }, { ...product, ...next }),
    });
  };

  const addProduct = (product: WeekProduct) => {
    setAdded((a) => [...a, product.id]);
    setQuery("");
    setSearchOpen(false);
    toast({ tone: "info", message: t("week.added", { name: product.name }) });
  };

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => !inWeek(p) && p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products, added, monday]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekLabel = `${fmt.dayMonth(days[0])} – ${fmt.dateMedium(days[5])}`;
  const weekLabelShort = `${fmt.dayMonth(days[0])} – ${fmt.dayMonth(days[5])}`;

  const searchBox = (
    <div className="relative">
      <Input
        ref={searchRef}
        icon={<Plus />}
        placeholder={t("week.addPlaceholder")}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && candidates[0]) {
            e.preventDefault();
            addProduct(candidates[0]);
          }
          if (e.key === "Escape") setSearchOpen(false);
        }}
        role="combobox"
        aria-expanded={searchOpen && query.length > 0}
        aria-autocomplete="list"
      />
      {searchOpen && query.trim() && (
        <div role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-bo-lg border border-bo-line bg-bo-surface p-1 shadow-bo-md">
          {candidates.length === 0 && <p className="px-3 py-2.5 text-bo-small text-bo-ink-3">{t("week.noResult")}</p>}
          {candidates.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addProduct(p)}
              className="flex w-full items-center gap-3 rounded-bo-sm px-2.5 py-2 text-left hover:bg-bo-subtle"
            >
              <Thumb src={p.image_url} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-bo-body font-medium text-bo-ink">{p.name}</span>
                {p.category?.name && <span className="block text-bo-small text-bo-ink-3">{p.category.name}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const nav = (
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={() => goWeek(thisMonday)} className="hidden lg:inline-flex" disabled={monday === thisMonday}>
        {t("week.today")}
      </Button>
      <div className="flex items-center overflow-hidden rounded-bo-md border border-bo-line-strong bg-bo-surface shadow-bo-xs">
        <button type="button" onClick={() => goWeek(addDays(monday, -7))} aria-label={t("week.prevWeek")} className="flex h-10 w-10 items-center justify-center text-bo-icon hover:bg-bo-subtle lg:h-9 lg:w-9">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="hidden h-9 items-center border-x border-bo-line px-3 text-bo-body font-medium text-bo-ink lg:flex">{weekLabel}</span>
        <button type="button" onClick={() => goWeek(addDays(monday, 7))} aria-label={t("week.nextWeek")} className="flex h-10 w-10 items-center justify-center border-l border-bo-line text-bo-icon hover:bg-bo-subtle lg:h-9 lg:w-9 lg:border-l-0">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const empty = <EmptyState icon={<Calendar />} title={t("week.emptyTitle")} description={t("week.emptyDesc")} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title={t("week.title")}
          subtitle={
            <>
              <span className="hidden lg:inline">{t("week.subtitle")}</span>
              <span className="lg:hidden">{weekLabelShort}</span>
            </>
          }
        />
        {nav}
      </div>

      {/* ── Mobile : vue par jour ── */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="grid grid-cols-6 gap-1.5">
          {days.map((d) => {
            const active = d === selectedDay;
            const n = countFor(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => setMobileDay(d)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-bo-lg border py-2",
                  active ? "border-bo-primary bg-bo-primary text-bo-ink-inverse" : "border-bo-line bg-bo-surface text-bo-ink",
                  d < today && !active && "opacity-60"
                )}
              >
                <span className={cn("text-bo-caption", active ? "text-bo-ink-inverse/80" : "text-bo-ink-3")}>{fmt.weekdayShort(d)}</span>
                <span className="text-bo-heading font-semibold">{Number(d.slice(8))}</span>
                <span className={cn("text-[11px]", active ? "text-bo-ink-inverse/80" : "text-bo-ink-3")}>{n > 0 ? t("week.dayCount", { count: n }) : "—"}</span>
              </button>
            );
          })}
        </div>
        <p className="text-bo-small text-bo-ink-3">{selectedDay === today ? t("week.selectedToday", { date: fmt.dateLong(selectedDay) }) : fmt.dateLong(selectedDay)}</p>
        <Card className="overflow-hidden">
          {rows.length === 0
            ? empty
            : rows.map((p) => {
                const on = checked(p, selectedDay);
                return (
                  <div key={p.id} className="flex items-center gap-3 border-b border-bo-line px-3 py-2.5 last:border-0">
                    <Thumb src={p.image_url} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-bo-body font-medium text-bo-ink">{p.name}</span>
                      <span className="block text-bo-small text-bo-ink-3">{on ? t("week.proposed") : t("week.notProposed")}</span>
                    </span>
                    <Toggle checked={on} disabled={selectedDay < today} onChange={(v) => toggleDay(p, selectedDay, v)} label={t("week.cell", { name: p.name, date: fmt.dateLong(selectedDay) })} />
                  </div>
                );
              })}
        </Card>
        {searchOpen || query ? (
          searchBox
        ) : (
          <Button
            variant="secondary"
            icon={<Plus className="h-4 w-4" />}
            className="h-12 w-full"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchRef.current?.focus(), 0);
            }}
          >
            {t("week.addButton")}
          </Button>
        )}
      </div>

      {/* ── Desktop : grille ── */}
      <Card className="hidden lg:block">
        <div className="border-b border-bo-line p-4">{searchBox}</div>
        {rows.length === 0 ? (
          empty
        ) : (
          <div role="grid" aria-label={t("week.title")}>
            <div role="row" className="grid grid-cols-[minmax(0,1fr)_repeat(6,96px)_48px] items-center border-b border-bo-line bg-bo-subtle px-5 py-2">
              <span role="columnheader" className="text-bo-caption font-medium text-bo-ink-2">
                {t("week.colProduct")}
              </span>
              {days.map((d) => (
                <span key={d} role="columnheader" className="flex justify-center">
                  <span className={cn("rounded-bo-sm px-2 py-1 text-center text-bo-caption leading-4", d === today ? "bg-bo-accent-subtle font-semibold text-bo-ink" : d < today ? "text-bo-ink-3" : "text-bo-ink-2")}>
                    {fmt.weekdayShort(d)}
                    <br />
                    {fmt.dayMonth(d)}
                  </span>
                </span>
              ))}
              <span />
            </div>
            {rows.map((p) => (
              <div key={p.id} role="row" className="grid min-h-[56px] grid-cols-[minmax(0,1fr)_repeat(6,96px)_48px] items-center border-b border-bo-line px-5 py-2">
                <span className="flex min-w-0 items-center gap-3">
                  <Thumb src={p.image_url} />
                  <span className="min-w-0">
                    <span className="block truncate text-bo-body font-medium text-bo-ink">{p.name}</span>
                    <span className="block truncate text-bo-small text-bo-ink-3">{isAllWeek(p) ? t("week.allWeek") : p.category?.name ?? ""}</span>
                  </span>
                </span>
                {days.map((d) => (
                  <span key={d} role="gridcell" className={cn("flex h-full items-center justify-center", d === today && "bg-bo-accent-subtle/40")}>
                    <Checkbox checked={checked(p, d)} disabled={d < today} onChange={(v) => toggleDay(p, d, v)} label={t("week.cell", { name: p.name, date: fmt.dateLong(d) })} />
                  </span>
                ))}
                <span className="flex justify-end">
                  <Button variant="ghost" iconOnly icon={<X className="h-4 w-4" />} aria-label={t("week.removeRow", { name: p.name })} onClick={() => removeRow(p)} />
                </span>
              </div>
            ))}
            <div role="row" className="grid grid-cols-[minmax(0,1fr)_repeat(6,96px)_48px] items-center bg-bo-subtle px-5 py-3 text-bo-body">
              <span className="text-bo-small font-medium text-bo-ink-2">{t("week.totalRow")}</span>
              {days.map((d) => (
                <span key={d} className={cn("text-center font-semibold tabular-nums", d < today ? "text-bo-ink-3" : "text-bo-ink")}>
                  {countFor(d) || "—"}
                </span>
              ))}
              <span />
            </div>
          </div>
        )}
      </Card>
      <p className="hidden items-center gap-1.5 text-bo-small text-bo-ink-3 lg:flex">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        {t("week.footnote")}
      </p>
    </div>
  );
}
