"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";

type ToastTone = "success" | "error" | "info";
type ToastInput = { message: string; tone?: ToastTone; actionLabel?: string; onAction?: () => void; persistent?: boolean };
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

export function useToast() {
  const push = useContext(ToastContext);
  if (!push) throw new Error("useToast doit être utilisé sous ToastProvider");
  return push;
}

const ICONS: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="h-[18px] w-[18px] text-bo-success" aria-hidden />,
  error: <AlertCircle className="h-[18px] w-[18px] text-bo-ink-danger" aria-hidden />,
  info: <Info className="h-[18px] w-[18px] text-bo-icon" aria-hidden />,
};

function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const { t } = useBoI18n();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Les erreurs restent affichées tant qu'on ne les ferme pas
    if (item.persistent || item.tone === "error") return;
    timer.current = setTimeout(onClose, item.onAction ? 6000 : 4000);
    return () => clearTimeout(timer.current);
  }, [item, onClose]);

  return (
    <div
      role={item.tone === "error" ? "alert" : "status"}
      className="pointer-events-auto flex w-full items-center gap-2.5 rounded-bo-lg border border-bo-line bg-bo-surface py-3 pl-3.5 pr-3 shadow-bo-md sm:w-auto sm:min-w-[260px] sm:max-w-[420px]"
    >
      {ICONS[item.tone ?? "success"]}
      <p className="flex-1 text-bo-body font-medium text-bo-ink">{item.message}</p>
      {item.actionLabel && item.onAction && (
        <button
          type="button"
          onClick={() => {
            item.onAction?.();
            onClose();
          }}
          className="shrink-0 text-bo-body font-semibold text-bo-ink-accent hover:underline"
        >
          {item.actionLabel}
        </button>
      )}
      <button type="button" onClick={onClose} aria-label={t("common.close")} className="shrink-0 rounded p-0.5 text-bo-icon hover:text-bo-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((input: ToastInput) => {
    const id = nextId.current++;
    setItems((prev) => [...prev.slice(-2), { ...input, id }]);
  }, []);

  const remove = useCallback((id: number) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-2 px-4",
          "bottom-[calc(96px+env(safe-area-inset-bottom))] lg:bottom-6 lg:left-auto lg:right-6 lg:items-end lg:px-0"
        )}
      >
        {items.map((item) => (
          <ToastView key={item.id} item={item} onClose={() => remove(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
