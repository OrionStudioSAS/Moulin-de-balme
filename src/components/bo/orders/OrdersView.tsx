"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Calendar, Check, ChevronRight, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { addDays, openDaysOfWeek } from "@/lib/bo/dates";
import { itemsCount, sortByPickup, STATUS_SLUGS, statusFromSlug } from "@/lib/bo/orders";
import type { Order } from "@/types";
import { Badge, ORDER_STATUS_TONE } from "@/components/bo/ui/Badge";
import { Button } from "@/components/bo/ui/Button";
import { Avatar, Card, EmptyState, PageHeader } from "@/components/bo/ui/Display";
import { Input } from "@/components/bo/ui/Field";
import { Menu } from "@/components/bo/ui/Menu";
import { Pills, Tabs, type TabItem } from "@/components/bo/ui/Tabs";
import OrderPanel from "./OrderPanel";

type DateFilter = "" | "aujourdhui" | "demain" | "semaine" | `${string}_${string}`;
const STATUS_ORDER = ["pending", "confirmed", "ready", "completed", "cancelled"] as const;

export default function OrdersView({ orders, today }: { orders: Order[]; today: string }) {
  const { t, fmt } = useBoI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const statut = sp.get("statut");
  const q = sp.get("q") ?? "";
  const date = (sp.get("date") ?? "") as DateFilter;
  const selectedId = sp.get("id");

  const [search, setSearch] = useState(q);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [range, setRange] = useState(() => {
    const [from = "", to = ""] = date.includes("_") ? date.split("_") : [];
    return { from, to, open: date.includes("_") };
  });

  const setParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Recherche : debounce 250 ms, conservée dans l'URL
  useEffect(() => {
    if (search === q) return;
    const id = setTimeout(() => setParams({ q: search.trim() || null }), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const week = new Set(openDaysOfWeek(today));
    const [from, to] = date.includes("_") ? date.split("_") : ["", ""];
    return orders.filter((o) => {
      if (needle && !`${o.customer_name} ${o.customer_email}`.toLowerCase().includes(needle)) return false;
      if (date === "aujourdhui" && o.pickup_date !== today) return false;
      if (date === "demain" && o.pickup_date !== addDays(today, 1)) return false;
      if (date === "semaine" && !week.has(o.pickup_date)) return false;
      if (from && o.pickup_date < from) return false;
      if (to && o.pickup_date > to) return false;
      return true;
    });
  }, [orders, q, date, today]);

  const isUpcoming = (o: Order) => o.pickup_date >= today && o.status !== "completed" && o.status !== "cancelled";
  const filterBy = (key: string) => {
    if (key === "toutes") return base;
    if (key === "a-venir") return base.filter(isUpcoming);
    const s = statusFromSlug(key);
    return s ? base.filter((o) => o.status === s) : base;
  };
  const count = (key: string) => filterBy(key).length;

  const desktopKey = statut && (statut === "toutes" || statusFromSlug(statut)) ? statut : "toutes";
  const mobileKey = statut ?? "a-venir";
  const desktopList = sortByPickup(filterBy(desktopKey), today);
  const mobileList = sortByPickup(filterBy(mobileKey), today);

  const tabItems: TabItem[] = [
    { key: "toutes", label: t("statusPlural.all"), count: count("toutes"), onClick: () => setParams({ statut: null }) },
    ...STATUS_ORDER.map((s) => ({
      key: STATUS_SLUGS[s],
      label: t(`statusPlural.${s}`),
      count: count(STATUS_SLUGS[s]),
      onClick: () => setParams({ statut: STATUS_SLUGS[s] }),
    })),
  ];
  const pillItems: TabItem[] = [
    { key: "a-venir", label: t("statusPlural.upcoming"), count: count("a-venir"), onClick: () => setParams({ statut: null }) },
    ...(["pending", "confirmed", "ready"] as const).map((s) => ({
      key: STATUS_SLUGS[s],
      label: t(`statusPlural.${s}`),
      count: count(STATUS_SLUGS[s]),
      onClick: () => setParams({ statut: STATUS_SLUGS[s] }),
    })),
    { key: "toutes", label: t("statusPlural.all"), count: count("toutes"), onClick: () => setParams({ statut: "toutes" }) },
    ...(["completed", "cancelled"] as const).map((s) => ({
      key: STATUS_SLUGS[s],
      label: t(`statusPlural.${s}`),
      count: count(STATUS_SLUGS[s]),
      onClick: () => setParams({ statut: STATUS_SLUGS[s] }),
    })),
  ];

  const dateLabel: Record<string, string> = {
    "": t("orders.pickupDate"),
    aujourdhui: t("orders.dateToday"),
    demain: t("orders.dateTomorrow"),
    semaine: t("orders.dateWeek"),
  };
  const currentDateLabel = date.includes("_")
    ? [range.from && fmt.dayMonth(range.from), range.to && fmt.dayMonth(range.to)].filter(Boolean).join(" – ")
    : dateLabel[date] ?? t("orders.pickupDate");

  const emptyFor = (key: string) => {
    if (q || date) {
      return (
        <EmptyState
          icon={<Search />}
          title={t("orders.emptySearch")}
          description={t("orders.emptySearchDesc")}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setRange({ from: "", to: "", open: false });
                setParams({ q: null, date: null });
              }}
            >
              {t("common.clearSearch")}
            </Button>
          }
        />
      );
    }
    const s = statusFromSlug(key);
    const map = {
      toutes: ["emptyAll", "emptyAllDesc"],
      "a-venir": ["emptyUpcoming", "emptyUpcomingDesc"],
      pending: ["emptyPending", "emptyPendingDesc"],
      confirmed: ["emptyConfirmed", "emptyConfirmedDesc"],
      ready: ["emptyReady", "emptyReadyDesc"],
      completed: ["emptyCompleted", "emptyCompletedDesc"],
      cancelled: ["emptyCancelled", "emptyCancelledDesc"],
    } as const;
    const [title, desc] = map[(s ?? key) as keyof typeof map] ?? map.toutes;
    return (
      <EmptyState
        icon={<ShoppingBag />}
        title={t(`orders.${title}`)}
        description={t(`orders.${desc}`)}
        action={
          key !== "toutes" && orders.length > 0 ? (
            <Button variant="secondary" onClick={() => setParams({ statut: "toutes" })}>
              {t("orders.seeAll")}
            </Button>
          ) : undefined
        }
      />
    );
  };

  const open = (id: string) => setParams({ id });
  const selected = selectedId ? orders.find((o) => o.id === selectedId) ?? null : null;

  const upcoming = mobileList.filter((o) => o.pickup_date >= today);
  const past = mobileList.filter((o) => o.pickup_date < today);

  return (
    <div className="flex flex-col gap-6">
      {/* ── En-tête ── */}
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title={t("orders.title")}
          subtitle={
            <>
              <span className="hidden lg:inline">{t("orders.subtitle")}</span>
              <span className="lg:hidden">{t("orders.mobileSubtitle")}</span>
            </>
          }
        />
        <Button variant="secondary" iconOnly icon={<Search className="h-5 w-5" />} aria-label={t("common.search")} className="h-10 w-10 lg:hidden" onClick={() => setMobileSearch(true)} />
      </div>

      {/* ── Mobile ── */}
      <div className="flex flex-col gap-4 lg:hidden">
        {mobileSearch && (
          <div className="fixed inset-0 z-50 flex flex-col gap-3 bg-bo-app p-4">
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                type="search"
                icon={<Search />}
                placeholder={t("orders.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                boxClassName="flex-1"
              />
              <Button variant="ghost" onClick={() => setMobileSearch(false)} className="h-12">
                {t("common.close")}
              </Button>
            </div>
            <div className="-mx-4 flex-1 overflow-y-auto px-4">
              <MobileList orders={sortByPickup(base, today)} today={today} onOpen={(id) => { setMobileSearch(false); open(id); }} />
            </div>
          </div>
        )}
        {q && (
          <button type="button" onClick={() => { setSearch(""); setParams({ q: null }); }} className="flex items-center gap-2 self-start rounded-full bg-bo-muted px-3 py-1.5 text-bo-small text-bo-ink">
            <Search className="h-3.5 w-3.5" /> « {q} » <X className="h-3.5 w-3.5" />
          </button>
        )}
        <Pills items={pillItems} active={mobileKey} />
        {mobileList.length === 0 ? (
          <Card>{emptyFor(mobileKey)}</Card>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="flex flex-col gap-3">
                <p className="text-bo-small text-bo-ink-3">{t("statusPlural.upcoming")}</p>
                <MobileList orders={upcoming} today={today} onOpen={open} />
              </section>
            )}
            {past.length > 0 && (
              <section className="flex flex-col gap-3">
                <p className="text-bo-small text-bo-ink-3">{t("statusPlural.past")}</p>
                <MobileList orders={past} today={today} onOpen={open} />
              </section>
            )}
          </>
        )}
      </div>

      {/* ── Desktop ── */}
      <Card className="hidden overflow-visible lg:block">
        <Tabs items={tabItems} active={desktopKey} />
        <div className="flex flex-wrap items-center gap-2 border-b border-bo-line px-4 py-3">
          <Input
            type="search"
            icon={<Search />}
            placeholder={t("orders.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            boxClassName="w-[320px] lg:h-9"
          />
          <Menu
            align="left"
            trigger={({ open: isOpen, toggle, id }) => (
              <Button
                variant="secondary"
                icon={<Calendar className="h-4 w-4" />}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={toggle}
                className={cn(date && "border-bo-focus bg-bo-accent-subtle")}
              >
                {currentDateLabel}
              </Button>
            )}
            items={[
              { key: "", label: t("orders.dateAny"), selected: date === "", onSelect: () => { setRange({ from: "", to: "", open: false }); setParams({ date: null }); } },
              { key: "aujourdhui", label: t("orders.dateToday"), selected: date === "aujourdhui", onSelect: () => setParams({ date: "aujourdhui" }) },
              { key: "demain", label: t("orders.dateTomorrow"), selected: date === "demain", onSelect: () => setParams({ date: "demain" }) },
              { key: "semaine", label: t("orders.dateWeek"), selected: date === "semaine", onSelect: () => setParams({ date: "semaine" }) },
              { key: "custom", label: t("orders.dateCustom"), selected: date.includes("_"), onSelect: () => setRange((r) => ({ ...r, open: true })) },
            ].map((it) => ({ ...it, icon: it.selected ? <Check /> : <span className="w-4" /> }))}
          />
          {range.open && (
            <div className="flex items-center gap-2">
              <label className="text-bo-small text-bo-ink-2" htmlFor="range-from">{t("orders.dateFrom")}</label>
              <Input id="range-from" type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} boxClassName="w-[150px] lg:h-9" />
              <label className="text-bo-small text-bo-ink-2" htmlFor="range-to">{t("orders.dateTo")}</label>
              <Input id="range-to" type="date" value={range.to} min={range.from || undefined} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} boxClassName="w-[150px] lg:h-9" />
              <Button variant="primary" disabled={!range.from && !range.to} onClick={() => setParams({ date: `${range.from}_${range.to}` })}>
                {t("orders.apply")}
              </Button>
            </div>
          )}
          <span className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-bo-md border border-bo-line-strong bg-bo-surface px-3.5 text-bo-body font-medium text-bo-ink shadow-bo-xs">
            <ArrowUpDown className="h-4 w-4 text-bo-icon" aria-hidden />
            {t("orders.sort")}
          </span>
        </div>

        {desktopList.length === 0 ? (
          emptyFor(desktopKey)
        ) : (
          <div role="table" aria-label={t("orders.title")}>
            <div role="row" className="grid grid-cols-[minmax(0,1fr)_150px_110px_100px_130px_20px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2">
              <span role="columnheader">{t("orders.colCustomer")}</span>
              <span role="columnheader">{t("orders.colPickup")}</span>
              <span role="columnheader">{t("orders.colItems")}</span>
              <span role="columnheader" className="text-right">{t("orders.colTotal")}</span>
              <span role="columnheader">{t("orders.colStatus")}</span>
              <span />
            </div>
            {desktopList.map((o) => (
              <button
                key={o.id}
                type="button"
                role="row"
                onClick={() => open(o.id)}
                className={cn(
                  "grid h-16 w-full grid-cols-[minmax(0,1fr)_150px_110px_100px_130px_20px] items-center gap-4 border-b border-bo-line px-5 text-left transition-colors last:border-0 hover:bg-bo-subtle",
                  o.id === selectedId && "bg-bo-accent-subtle hover:bg-bo-accent-subtle"
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar name={o.customer_name} />
                  <span className="min-w-0">
                    <span className="block truncate text-bo-body font-medium text-bo-ink">{o.customer_name}</span>
                    <span className="block truncate text-bo-small text-bo-ink-3">{o.customer_email}</span>
                  </span>
                </span>
                <span>
                  <span className={cn("block text-bo-body font-medium", o.pickup_date < today ? "text-bo-ink-2" : "text-bo-ink")}>{fmt.dateShort(o.pickup_date)}</span>
                  <span className="block text-bo-small text-bo-ink-3">{fmt.time(o.pickup_time)}</span>
                </span>
                <span className="text-bo-body text-bo-ink-2">{t("common.items", { count: itemsCount(o) })}</span>
                <span className="text-right text-bo-body font-medium text-bo-ink tabular-nums">{fmt.price(o.total_amount)}</span>
                <span>
                  <Badge tone={ORDER_STATUS_TONE[o.status]} dot>
                    {t(`status.${o.status}`)}
                  </Badge>
                </span>
                <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </Card>

      {selected && <OrderPanel key={selected.id} order={selected} onClose={() => setParams({ id: null })} />}
      {selectedId && !selected && <MissingOrder onClose={() => setParams({ id: null })} />}
    </div>
  );
}

function MobileList({ orders, today, onOpen }: { orders: Order[]; today: string; onOpen: (id: string) => void }) {
  const { t, fmt } = useBoI18n();
  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => (
        <button key={o.id} type="button" onClick={() => onOpen(o.id)} className="rounded-bo-lg border border-bo-line bg-bo-surface text-left">
          <span className="flex items-center gap-3 p-4">
            <Avatar name={o.customer_name} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-bo-body font-medium text-bo-ink">{o.customer_name}</span>
              <span className="block truncate text-bo-small text-bo-ink-3">
                {t("common.items", { count: itemsCount(o) })} · {fmt.price(o.total_amount)}
              </span>
            </span>
            <Badge tone={ORDER_STATUS_TONE[o.status]} dot>
              {t(`status.${o.status}`)}
            </Badge>
          </span>
          <span className="flex items-center gap-2 border-t border-bo-line px-4 py-3 text-bo-body font-medium text-bo-ink">
            <Calendar className="h-4 w-4 text-bo-icon" aria-hidden />
            <span className={cn("flex-1", o.pickup_date < today && "text-bo-ink-2")}>
              {fmt.dateShort(o.pickup_date)} · {fmt.time(o.pickup_time)}
            </span>
            <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
          </span>
        </button>
      ))}
    </div>
  );
}

function MissingOrder({ onClose }: { onClose: () => void }) {
  const { t } = useBoI18n();
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Link href="/admin/commandes" className="sr-only">{t("orders.seeAll")}</Link>;
}
