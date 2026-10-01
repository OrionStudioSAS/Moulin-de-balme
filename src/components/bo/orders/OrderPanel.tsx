"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Calendar, Check, ChevronLeft, Mail, X } from "lucide-react";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { portalRoot, useMounted } from "@/lib/bo/portal";
import { isClosed, itemsCount, NEXT_STATUS, orderItems, type OrderStatus } from "@/lib/bo/orders";
import type { Order } from "@/types";
import { Badge, ORDER_STATUS_TONE } from "@/components/bo/ui/Badge";
import { Button, buttonClass } from "@/components/bo/ui/Button";
import { Avatar, Thumb } from "@/components/bo/ui/Display";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { OrderStepper } from "@/components/bo/ui/OrderStepper";
import { useToast } from "@/components/bo/ui/Toast";

const ACTION_LABEL = {
  confirmed: "orders.actionConfirm",
  ready: "orders.actionReady",
  completed: "orders.actionComplete",
} as const;

export default function OrderPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const { t, fmt } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => setStatus(order.status), [order.status]);

  useEffect(() => {
    if (mounted) panel.current?.focus();
  }, [mounted]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmCancel) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, confirmCancel]);

  const items = orderItems(order);
  const count = itemsCount(order);
  const next = NEXT_STATUS[status];

  const changeStatus = async (newStatus: OrderStatus) => {
    setBusy(true);
    const previous = status;
    setStatus(newStatus);
    const res = await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, newStatus }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setStatus(previous);
      toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: () => changeStatus(newStatus) });
      return false;
    }
    router.refresh();
    return true;
  };

  const advance = async () => {
    if (!next) return;
    if (await changeStatus(next)) toast({ tone: "success", message: t("orders.statusUpdated", { status: t(`status.${next}`) }) });
  };

  const cancelOrder = async () => {
    setCancelError(null);
    setBusy(true);
    const res = await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, newStatus: "cancelled" }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setCancelError(t("common.errorGeneric"));
      return;
    }
    setStatus("cancelled");
    setConfirmCancel(false);
    toast({ tone: "success", message: t("orders.cancelled") });
    router.refresh();
  };

  if (!mounted) return null;

  const title = t("orders.orderOf", { name: order.customer_name });
  const sectionLabel = "mb-2 text-bo-small text-bo-ink-3";

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 hidden bg-bo-overlay/40 lg:block" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="absolute inset-0 flex flex-col bg-bo-app outline-none lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[480px] lg:bg-bo-surface lg:shadow-bo-lg"
      >
        {/* Barre mobile */}
        <div className="flex h-[52px] shrink-0 items-center gap-1 px-2 lg:hidden">
          <button type="button" onClick={onClose} aria-label={t("nav.back")} className="flex h-10 w-10 items-center justify-center rounded-bo-md text-bo-ink">
            <ChevronLeft className="h-[22px] w-[22px]" />
          </button>
          <span className="text-bo-heading font-semibold text-bo-ink">{t("orders.single")}</span>
        </div>

        {/* En-tête */}
        <div className="flex shrink-0 items-start gap-3 px-4 pb-4 lg:border-b lg:border-bo-line lg:px-6 lg:py-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-semibold leading-7 text-bo-ink lg:text-bo-heading">{title}</h2>
              <Badge tone={ORDER_STATUS_TONE[status]} dot className="ml-auto lg:ml-0">
                {t(`status.${status}`)}
              </Badge>
            </div>
            <p className="mt-0.5 hidden text-bo-small text-bo-ink-3 lg:block">{t("orders.meta", { items: t("common.items", { count }) })}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("common.close")} className="hidden rounded-bo-sm p-1 text-bo-icon hover:text-bo-ink lg:block">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6 lg:pt-6">
          {status !== "cancelled" && (
            <div className="mb-6">
              <OrderStepper status={status} />
            </div>
          )}

          <section className="mb-5">
            <p className={sectionLabel}>{t("orders.pickup")}</p>
            <p className="flex items-center gap-2.5 rounded-bo-lg border border-bo-line bg-bo-surface p-4 text-bo-body font-semibold text-bo-ink lg:border-0 lg:p-0">
              <Calendar className="h-4 w-4 text-bo-icon" aria-hidden />
              {fmt.dateLong(order.pickup_date)} · {fmt.time(order.pickup_time)}
            </p>
          </section>

          <section className="mb-5">
            <p className={sectionLabel}>{t("orders.customer")}</p>
            <div className="flex items-center gap-3 rounded-bo-lg border border-bo-line bg-bo-surface p-4 lg:border-0 lg:p-0">
              <Avatar name={order.customer_name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-bo-body font-medium text-bo-ink">{order.customer_name}</p>
                <a href={`mailto:${order.customer_email}`} className="block truncate text-bo-small text-bo-ink-accent hover:underline">
                  {order.customer_email}
                </a>
              </div>
              <a href={`mailto:${order.customer_email}`} className={buttonClass({ variant: "secondary", className: "h-10 w-10 px-0 lg:h-9 lg:w-auto lg:px-3.5" })} aria-label={t("orders.write")}>
                <Mail className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">{t("orders.write")}</span>
              </a>
            </div>
          </section>

          <section className="mb-5">
            <p className={sectionLabel}>{t("orders.items")}</p>
            <div className="overflow-hidden rounded-bo-lg border border-bo-line bg-bo-surface">
              {items.length === 0 && <p className="p-4 text-bo-small text-bo-ink-3">{t("orders.noItems")}</p>}
              {items.map((item, i) => (
                <div key={`${item.product_id}-${i}`} className="flex items-center gap-3 border-b border-bo-line px-4 py-3 last:border-b">
                  <Thumb size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-bo-body font-medium text-bo-ink">{item.product_name}</p>
                    <p className="text-bo-small text-bo-ink-3">{t("orders.unitPrice", { price: fmt.price(item.unit_price), qty: item.quantity })}</p>
                  </div>
                  <span className="text-bo-body font-medium text-bo-ink tabular-nums">{fmt.price(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-bo-subtle px-4 py-3 text-bo-body font-semibold text-bo-ink">
                <span>{t("orders.total")}</span>
                <span className="tabular-nums">{fmt.price(order.total_amount)}</span>
              </div>
            </div>
          </section>

          {order.notes?.trim() && (
            <section>
              <p className={sectionLabel}>{t("orders.notes")}</p>
              <p className="whitespace-pre-line rounded-bo-lg border border-bo-line bg-bo-surface p-4 text-bo-body text-bo-ink-2">{order.notes}</p>
            </section>
          )}
        </div>

        {/* Actions */}
        {!isClosed(status) && (
          <div className="shrink-0 border-t border-bo-line bg-bo-surface px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 lg:px-6">
            <div className="flex flex-col gap-2 lg:flex-row-reverse lg:items-center lg:justify-between">
              {next && (
                <Button variant="primary" loading={busy} onClick={advance} icon={<Check className="h-4 w-4" />} className="h-12 w-full lg:h-9 lg:w-auto">
                  {t(ACTION_LABEL[next as keyof typeof ACTION_LABEL])}
                </Button>
              )}
              <Button variant="danger" onClick={() => setConfirmCancel(true)} disabled={busy} className="h-11 w-full border-0 shadow-none lg:h-9 lg:w-auto lg:border lg:shadow-bo-xs">
                {t("orders.cancelOrder")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmCancel}
        title={t("orders.cancelTitle", { name: order.customer_name })}
        description={t("orders.cancelDesc", { email: order.customer_email })}
        confirmLabel={t("orders.cancelConfirm")}
        cancelLabel={t("common.back")}
        loading={busy}
        error={cancelError}
        onConfirm={cancelOrder}
        onClose={() => {
          setConfirmCancel(false);
          setCancelError(null);
        }}
      />
    </div>,
    portalRoot()
  );
}
