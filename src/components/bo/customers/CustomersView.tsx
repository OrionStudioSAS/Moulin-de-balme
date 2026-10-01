"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Search, Users } from "lucide-react";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { Customer } from "@/lib/bo/customers";
import { Avatar, Card, EmptyState, PageHeader } from "@/components/bo/ui/Display";
import { Button } from "@/components/bo/ui/Button";
import { Input } from "@/components/bo/ui/Field";

export const customerHref = (email: string) => `/admin/clients/${encodeURIComponent(email.toLowerCase())}`;

export default function CustomersView({ customers }: { customers: Customer[] }) {
  const { t, fmt } = useBoI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const [search, setSearch] = useState(q);

  useEffect(() => {
    if (search === q) return;
    const id = setTimeout(() => router.replace(search.trim() ? `${pathname}?q=${encodeURIComponent(search.trim())}` : pathname, { scroll: false }), 250);
    return () => clearTimeout(id);
  }, [search, q, pathname, router]);

  const needle = q.toLowerCase();
  const visible = customers.filter((c) => !needle || `${c.name} ${c.email} ${c.otherNames.join(" ")}`.toLowerCase().includes(needle));

  const empty =
    customers.length === 0 ? (
      <EmptyState icon={<Users />} title={t("customers.emptyTitle")} description={t("customers.emptyDesc")} />
    ) : (
      <EmptyState
        icon={<Search />}
        title={t("customers.emptySearch")}
        description={t("customers.emptySearchDesc")}
        action={
          <Button variant="secondary" onClick={() => setSearch("")}>
            {t("common.clearSearch")}
          </Button>
        }
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("customers.title")} subtitle={t("customers.subtitle", { count: customers.length })} />
      <Card>
        <div className="border-b border-bo-line p-3 lg:p-4">
          <Input type="search" icon={<Search />} placeholder={t("customers.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} boxClassName="lg:w-[320px] lg:h-9" />
        </div>
        {visible.length === 0 ? (
          empty
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_150px_120px_20px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2 lg:grid">
              <span>{t("customers.colCustomer")}</span>
              <span>{t("customers.colOrders")}</span>
              <span>{t("customers.colLastPickup")}</span>
              <span className="text-right">{t("customers.colSpent")}</span>
              <span />
            </div>
            {visible.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => router.push(customerHref(c.email))}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto_20px] items-center gap-3 border-b border-bo-line px-4 py-3 text-left transition-colors last:border-0 hover:bg-bo-subtle lg:h-16 lg:grid-cols-[minmax(0,1fr)_120px_150px_120px_20px] lg:gap-4 lg:px-5 lg:py-0"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar name={c.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-bo-body font-medium text-bo-ink">{c.name}</span>
                    <span className="block truncate text-bo-small text-bo-ink-3">{c.email}</span>
                  </span>
                </span>
                <span className="hidden text-bo-body text-bo-ink-2 lg:block">{c.ordersCount}</span>
                <span className="hidden text-bo-body text-bo-ink-2 lg:block">{c.lastPickup ? fmt.dateShort(c.lastPickup.pickup_date) : "—"}</span>
                <span className="text-right text-bo-body font-medium text-bo-ink tabular-nums">
                  {fmt.price(c.spent)}
                  <span className="block text-bo-small font-normal text-bo-ink-3 lg:hidden">{t("common.orders", { count: c.ordersCount })}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
              </button>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
