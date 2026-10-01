import Link from "next/link";
import { cn } from "@/lib/bo/cn";
import { Count } from "./Badge";

export type TabItem = { key: string; label: string; count?: number; href?: string; onClick?: () => void };

/** Onglets soulignés (desktop) */
export function Tabs({ items, active, className }: { items: TabItem[]; active: string; className?: string }) {
  return (
    <div role="tablist" className={cn("flex gap-5 overflow-x-auto border-b border-bo-line px-4 [scrollbar-width:none]", className)}>
      {items.map((item) => {
        const isActive = item.key === active;
        const content = (
          <>
            <span>{item.label}</span>
            {item.count !== undefined && <Count value={item.count} active={isActive} />}
          </>
        );
        const cls = cn(
          "-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-0.5 pb-2.5 pt-3 text-bo-body font-medium whitespace-nowrap transition-colors",
          isActive ? "border-bo-primary text-bo-ink" : "border-transparent text-bo-ink-2 hover:text-bo-ink"
        );
        return item.href ? (
          <Link key={item.key} href={item.href} role="tab" aria-selected={isActive} className={cls} scroll={false}>
            {content}
          </Link>
        ) : (
          <button key={item.key} type="button" role="tab" aria-selected={isActive} onClick={item.onClick} className={cls}>
            {content}
          </button>
        );
      })}
    </div>
  );
}

/** Filtres en pastilles (mobile) */
export function Pills({ items, active, className }: { items: TabItem[]; active: string; className?: string }) {
  return (
    <div className={cn("-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]", className)}>
      {items.map((item) => {
        const isActive = item.key === active;
        const cls = cn(
          "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-bo-body font-medium whitespace-nowrap transition-colors",
          isActive ? "border-bo-primary bg-bo-primary text-bo-ink-inverse" : "border-bo-line-strong bg-bo-surface text-bo-ink"
        );
        const content = (
          <>
            {item.label}
            {item.count !== undefined && <span className={cn("tabular-nums", isActive ? "text-bo-ink-inverse" : "text-bo-ink-3")}>{item.count}</span>}
          </>
        );
        return item.href ? (
          <Link key={item.key} href={item.href} className={cls} scroll={false} aria-current={isActive ? "page" : undefined}>
            {content}
          </Link>
        ) : (
          <button key={item.key} type="button" onClick={item.onClick} className={cls} aria-pressed={isActive}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
