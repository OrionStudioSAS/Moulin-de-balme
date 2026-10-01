"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";

const STEPS = ["pending", "confirmed", "ready", "completed"] as const;

/** Suivi de commande (En attente → Confirmée → Prête → Retirée). Rien pour une commande annulée. */
export function OrderStepper({ status }: { status: string }) {
  const { t } = useBoI18n();
  const current = STEPS.indexOf(status as (typeof STEPS)[number]);
  if (current < 0) return null;
  const allDone = status === "completed";
  const progress = current / (STEPS.length - 1);

  return (
    <ol className="relative grid grid-cols-4">
      <span className="absolute left-[12.5%] right-[12.5%] top-[11px] h-0.5 bg-bo-line-strong" aria-hidden />
      <span className="absolute left-[12.5%] top-[11px] h-0.5 bg-bo-primary" style={{ width: `${progress * 75}%` }} aria-hidden />
      {STEPS.map((step, i) => {
        const done = i < current || allDone;
        const isCurrent = i === current && !allDone;
        return (
          <li key={step} className="relative flex flex-col items-center gap-1.5" aria-current={isCurrent ? "step" : undefined}>
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2",
                done && "border-bo-primary bg-bo-primary text-bo-ink-inverse",
                isCurrent && "border-bo-primary bg-bo-surface",
                !done && !isCurrent && "border-bo-line-strong bg-bo-surface"
              )}
            >
              {done && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
              {isCurrent && <span className="h-2.5 w-2.5 rounded-full bg-bo-primary" aria-hidden />}
            </span>
            <span className={cn("text-center text-bo-caption font-medium", done || isCurrent ? "text-bo-ink" : "text-bo-ink-3")}>
              {t(`status.${step}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
