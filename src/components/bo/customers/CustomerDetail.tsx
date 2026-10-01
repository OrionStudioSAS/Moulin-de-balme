"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Mail } from "lucide-react";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { Customer } from "@/lib/bo/customers";
import { itemsCount } from "@/lib/bo/orders";
import { Badge, Count, ORDER_STATUS_TONE } from "@/components/bo/ui/Badge";
import { buttonClass } from "@/components/bo/ui/Button";
import { Avatar, Card } from "@/components/bo/ui/Display";
import { MobileTopBar } from "@/components/bo/shell/MobileNav";
import OrderPanel from "@/components/bo/orders/OrderPanel";

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="flex flex-col gap-1.5 p-4 lg:p-5">
      <span className="text-bo-small font-medium text-bo-ink-2">{label}</span>
      <span className="text-bo-kpi font-semibold text-bo-ink">{value}</span>
      <span className="text-bo-small text-bo-ink-3">{hint}</span>
    </Card>
  );
}

export default function CustomerDetail({ customer }: { customer: Customer }) {
  const { t, fmt } = useBoI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = customer.orders.find((o) => o.id === openId) ?? null;
  const mail = `mailto:${customer.email}`;

  return (
    <div className="flex flex-col gap-5">
      <MobileTopBar variant="detail" title={t("customers.back")} backHref="/admin/clients" />
      <div className="hidden lg:block">
        <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-bo-small text-bo-ink-2 hover:text-bo-ink">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("customers.back")}
        </Link>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate font-bo-serif text-bo-display-s font-normal text-bo-ink lg:text-bo-display">{customer.name}</h1>
        <a href={mail} className={buttonClass({ variant: "secondary", className: "shrink-0" })}>
          <Mail className="h-4 w-4" aria-hidden />
          {t("customers.write")}
        </a>
      </div>

      <Card className="flex items-center gap-3 p-4">
        <Avatar name={customer.name} />
        <div className="min-w-0">
          <a href={mail} className="block truncate text-bo-body font-medium text-bo-ink-accent hover:underline">
            {customer.email}
          </a>
          <p className="text-bo-small text-bo-ink-3">{t("customers.since", { date: fmt.dateDMY(customer.firstOrderAt) })}</p>
          {customer.otherNames.length > 0 && <p className="text-bo-small text-bo-ink-3">{t("customers.alsoAs", { names: customer.otherNames.join(", ") })}</p>}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <Stat
          label={t("customers.orders")}
          value={String(customer.ordersCount)}
          hint={customer.cancelledCount > 0 ? t("customers.cancelledCount", { count: customer.cancelledCount }) : t("customers.noCancelled")}
        />
        <Stat label={t("customers.spent")} value={fmt.price(customer.spent)} hint={t("customers.spentHint")} />
        <Stat
          label={t("customers.lastPickup")}
          value={customer.lastPickup ? fmt.dateShort(customer.lastPickup.pickup_date) : "—"}
          hint={customer.lastPickup ? fmt.time(customer.lastPickup.pickup_time) : ""}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-bo-line px-5 py-4">
          <h2 className="text-bo-card font-semibold text-bo-ink">{t("customers.orders")}</h2>
          <Count value={customer.ordersCount} />
        </div>
        <div className="hidden grid-cols-[minmax(0,1fr)_120px_100px_130px_20px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2 lg:grid">
          <span>{t("orders.colPickup")}</span>
          <span>{t("orders.colItems")}</span>
          <span className="text-right">{t("orders.colTotal")}</span>
          <span>{t("orders.colStatus")}</span>
          <span />
        </div>
        {customer.orders.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOpenId(o.id)}
            className="grid w-full grid-cols-[minmax(0,1fr)_auto_20px] items-center gap-3 border-b border-bo-line px-4 py-3 text-left transition-colors last:border-0 hover:bg-bo-subtle lg:h-16 lg:grid-cols-[minmax(0,1fr)_120px_100px_130px_20px] lg:gap-4 lg:px-5 lg:py-0"
          >
            <span>
              <span className="block text-bo-body font-medium text-bo-ink">{fmt.dateShort(o.pickup_date)}</span>
              <span className="block text-bo-small text-bo-ink-3">
                {fmt.time(o.pickup_time)}
                <span className="lg:hidden"> · {t("common.items", { count: itemsCount(o) })} · {fmt.price(o.total_amount)}</span>
              </span>
            </span>
            <span className="hidden text-bo-body text-bo-ink-2 lg:block">{t("common.items", { count: itemsCount(o) })}</span>
            <span className="hidden text-right text-bo-body font-medium text-bo-ink tabular-nums lg:block">{fmt.price(o.total_amount)}</span>
            <span>
              <Badge tone={ORDER_STATUS_TONE[o.status]} dot>
                {t(`status.${o.status}`)}
              </Badge>
            </span>
            <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
          </button>
        ))}
      </Card>

      {selected && <OrderPanel key={selected.id} order={selected} onClose={() => setOpenId(null)} />}
    </div>
  );
}

