import Link from "next/link";
import type { ReactNode } from "react";
import { Calendar, Clock, Package, Plus, ShoppingBag } from "lucide-react";
import { getBoI18n } from "@/lib/bo/i18n/server";
import { addDays, openDaysOfWeek } from "@/lib/bo/dates";
import { aggregateItems, itemsCount, sortByPickup, STATUS_SLUGS } from "@/lib/bo/orders";
import { firstName } from "@/lib/bo/user";
import { cn } from "@/lib/bo/cn";
import type { Order, Product } from "@/types";
import { Badge, ORDER_STATUS_TONE } from "@/components/bo/ui/Badge";
import { ButtonLink } from "@/components/bo/ui/Button";
import { Avatar, Card, CardHeader, PageHeader } from "@/components/bo/ui/Display";
import { MobileTopBar } from "@/components/bo/shell/MobileNav";
import { displayName } from "@/lib/bo/user";

function Kpi({ href, icon, label, short, value, extra, hint }: { href: string; icon: ReactNode; label: string; short?: string; value: number; extra?: ReactNode; hint: string }) {
  return (
    <Link href={href} className="flex flex-col gap-2 rounded-bo-lg border border-bo-line bg-bo-surface p-4 transition-colors hover:border-bo-line-strong lg:p-5">
      <span className="flex items-center gap-2 text-bo-small font-medium text-bo-ink-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-bo-icon">
        {icon}
        <span className="truncate">
          <span className="lg:hidden">{short ?? label}</span>
          <span className="hidden lg:inline">{label}</span>
        </span>
      </span>
      <span className="flex items-center gap-2.5">
        <span className="text-bo-kpi font-semibold text-bo-ink tabular-nums">{value}</span>
        {extra && <span className="hidden lg:inline-flex">{extra}</span>}
      </span>
      <span className="hidden truncate text-bo-small text-bo-ink-3 lg:block">{hint}</span>
    </Link>
  );
}

export type DashboardData = {
  user: { email?: string; user_metadata?: Record<string, unknown> } | null;
  orders: Order[];
  productsCount: number;
  semaine: Pick<Product, "id" | "available_days">[];
  today: string;
};

export default function DashboardView({ user, orders, productsCount, semaine, today }: DashboardData) {
  const { t, fmt } = getBoI18n();
  const tomorrow = addDays(today, 1);
  const week = openDaysOfWeek(today);

  const pending = orders.filter((o) => o.status === "pending").length;
  const tomorrowOrders = sortByPickup(
    orders.filter((o) => o.pickup_date === tomorrow && o.status !== "cancelled"),
    today
  );
  const toPrepare = aggregateItems(tomorrowOrders.filter((o) => o.status === "confirmed" || o.status === "ready"));
  const recent = [...orders]
    .sort((a, b) => `${b.pickup_date}T${b.pickup_time}`.localeCompare(`${a.pickup_date}T${a.pickup_time}`))
    .slice(0, 5);

  const perDay = week.map((day) => ({
    day,
    count: semaine.filter((p) => !p.available_days?.length || p.available_days.includes(day)).length,
  }));

  const name = user ? firstName(user) : null;
  const ordersHref = "/admin/commandes";
  const ordersMeta = t("common.orders", { count: tomorrowOrders.length });

  return (
    <div className="flex flex-col gap-6">
      <MobileTopBar variant="root" userName={user ? displayName(user) : undefined} />

      <PageHeader
        title={name ? t("dashboard.hello", { name }) : t("dashboard.helloAnon")}
        subtitle={
          <>
            <span className="hidden lg:inline">{fmt.dateFull(today)}</span>
            <span className="lg:hidden">{fmt.dateLong(today)}</span>
          </>
        }
        actions={
          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink href="/admin/la-semaine" variant="secondary" icon={<Calendar className="h-4 w-4" />}>
              {t("dashboard.planWeek")}
            </ButtonLink>
            <ButtonLink href="/admin/produits/nouveau" variant="primary" icon={<Plus className="h-4 w-4" />}>
              {t("dashboard.addProduct")}
            </ButtonLink>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi
          href={`${ordersHref}?statut=${STATUS_SLUGS.pending}`}
          icon={<Clock />}
          label={t("dashboard.toConfirm")}
          value={pending}
          extra={pending === 0 ? <Badge tone="success" dot>{t("dashboard.upToDate")}</Badge> : undefined}
          hint={pending === 0 ? t("dashboard.noPending") : t("dashboard.pendingHint", { count: pending })}
        />
        <Kpi
          href={`${ordersHref}?date=demain`}
          icon={<ShoppingBag />}
          label={t("dashboard.pickupsTomorrow")}
          value={tomorrowOrders.length}
          hint={fmt.dateLong(tomorrow)}
        />
        <Kpi href={ordersHref} icon={<Calendar />} label={t("dashboard.totalOrders")} short={t("dashboard.totalOrdersShort")} value={orders.length} hint={t("dashboard.sinceOpening")} />
        <Kpi href="/admin/produits" icon={<Package />} label={t("dashboard.productsKpi")} value={productsCount} hint={t("dashboard.inCatalog")} />
      </div>

      {/* Mobile : demain */}
      <Card className="lg:hidden">
        <CardHeader
          title={t("dashboard.tomorrow", { date: fmt.dateShort(tomorrow) })}
          action={<Badge tone="neutral">{ordersMeta}</Badge>}
          className="border-0 pb-2"
        />
        <div className="flex flex-col gap-2 px-4 pb-4">
          {tomorrowOrders.length === 0 && <p className="text-bo-small text-bo-ink-3">{t("dashboard.nothingTomorrow")}</p>}
          {tomorrowOrders.map((o) => (
            <Link key={o.id} href={`${ordersHref}?id=${o.id}`} className="flex items-center gap-3 rounded-bo-md bg-bo-subtle p-3">
              <Avatar name={o.customer_name} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-bo-body font-medium text-bo-ink">{o.customer_name}</span>
                <span className="block truncate text-bo-small text-bo-ink-3">
                  {fmt.time(o.pickup_time)} · {t("common.items", { count: itemsCount(o) })} · {fmt.price(o.total_amount)}
                </span>
              </span>
              <Badge tone={ORDER_STATUS_TONE[o.status]} dot>
                {t(`status.${o.status}`)}
              </Badge>
            </Link>
          ))}
          {toPrepare.length > 0 && (
            <div className="mt-2">
              <p className="mb-2 text-bo-caption text-bo-ink-3">{t("dashboard.toPrepare")}</p>
              <PrepareList items={toPrepare} />
            </div>
          )}
        </div>
      </Card>

      <div className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="self-start overflow-hidden">
          <CardHeader
            title={t("dashboard.recentOrders")}
            action={
              <ButtonLink href={ordersHref} variant="ghost">
                {t("dashboard.seeAllOrders")}
              </ButtonLink>
            }
          />
          <div className="grid grid-cols-[minmax(0,1fr)_140px_90px_110px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2">
            <span>{t("orders.colCustomer")}</span>
            <span>{t("orders.colPickup")}</span>
            <span className="text-right">{t("orders.colTotal")}</span>
            <span>{t("orders.colStatus")}</span>
          </div>
          {recent.length === 0 && <p className="px-5 py-10 text-center text-bo-small text-bo-ink-3">{t("dashboard.noOrders")}</p>}
          {recent.map((o) => (
            <Link
              key={o.id}
              href={`${ordersHref}?id=${o.id}`}
              className="grid h-16 grid-cols-[minmax(0,1fr)_140px_90px_110px] items-center gap-4 border-b border-bo-line px-5 transition-colors last:border-0 hover:bg-bo-subtle"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Avatar name={o.customer_name} />
                <span className="min-w-0">
                  <span className="block truncate text-bo-body font-medium text-bo-ink">{o.customer_name}</span>
                  <span className="block truncate text-bo-small text-bo-ink-3">{o.customer_email}</span>
                </span>
              </span>
              <span>
                <span className="block text-bo-body font-medium text-bo-ink">{fmt.dateShort(o.pickup_date)}</span>
                <span className="block text-bo-small text-bo-ink-3">{fmt.time(o.pickup_time)}</span>
              </span>
              <span className="text-right text-bo-body font-medium text-bo-ink tabular-nums">{fmt.price(o.total_amount)}</span>
              <span>
                <Badge tone={ORDER_STATUS_TONE[o.status]} dot>
                  {t(`status.${o.status}`)}
                </Badge>
              </span>
            </Link>
          ))}
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4 p-5">
            <div>
              <p className="flex items-center gap-2 text-bo-card font-semibold text-bo-ink">
                {t("dashboard.prepareTomorrow")}
                <Badge tone="accent">{t("dashboard.new")}</Badge>
              </p>
              <p className="mt-0.5 text-bo-small text-bo-ink-3">
                {t("dashboard.tomorrowMeta", { date: fmt.dateLong(tomorrow), orders: ordersMeta })}
              </p>
            </div>
            {toPrepare.length === 0 ? (
              <p className="text-bo-small text-bo-ink-3">{t("dashboard.nothingTomorrow")}</p>
            ) : (
              <PrepareList items={toPrepare} />
            )}
            <ButtonLink href={`${ordersHref}?date=demain`} variant="secondary" className="w-full">
              {t("dashboard.seeTomorrowOrders")}
            </ButtonLink>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-bo-card font-semibold text-bo-ink">{t("dashboard.thisWeek")}</p>
                <p className="mt-0.5 text-bo-small text-bo-ink-3">
                  {t("dashboard.weekMeta", { range: `${fmt.dayMonth(week[0])} – ${fmt.dayMonth(week[5])}` })}
                </p>
              </div>
              <ButtonLink href="/admin/la-semaine" variant="ghost">
                {t("dashboard.manage")}
              </ButtonLink>
            </div>
            <ul className="mt-3">
              {perDay.map(({ day, count }) => {
                const isToday = day === today;
                const past = day < today;
                return (
                  <li key={day} className="flex h-11 items-center gap-2 border-b border-bo-line last:border-0">
                    <span className={cn("text-bo-body", isToday ? "font-semibold text-bo-ink" : past ? "text-bo-ink-3" : "text-bo-ink")}>
                      {fmt.weekdayDay(day)}
                    </span>
                    {isToday && <Badge tone="accent">{t("common.today")}</Badge>}
                    <span className={cn("ml-auto text-bo-body", past ? "text-bo-ink-3" : "text-bo-ink-2")}>
                      {count > 0 ? t("common.products", { count }) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PrepareList({ items }: { items: { name: string; quantity: number }[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3 text-bo-body text-bo-ink">
          <span className="inline-flex h-6 min-w-[36px] items-center justify-center rounded-bo-sm bg-bo-muted px-1.5 text-bo-small font-medium tabular-nums">
            × {item.quantity}
          </span>
          <span className="min-w-0 truncate">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
