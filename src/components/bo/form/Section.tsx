import type { ReactNode } from "react";
import { cn } from "@/lib/bo/cn";

export function Section({ title, hint, action, children, className }: { title: ReactNode; hint?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-bo-lg border border-bo-line bg-bo-surface p-4 lg:p-5", className)}>
      <div className="mb-4 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-bo-card font-semibold text-bo-ink">{title}</h2>
          {hint && <p className="mt-0.5 text-bo-small text-bo-ink-3">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

/** Ligne interrupteur + libellé + aide (colonne « Statut et options ») */
export function ToggleRow({ label, hint, control }: { label: ReactNode; hint?: ReactNode; control: ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-b border-bo-line pb-3 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-bo-body font-medium text-bo-ink">{label}</p>
        {hint && <p className="mt-0.5 text-bo-small text-bo-ink-3">{hint}</p>}
      </div>
      <div className="pt-0.5">{control}</div>
    </div>
  );
}
