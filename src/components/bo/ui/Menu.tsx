"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/bo/cn";

export type MenuItem = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  href?: string;
  external?: boolean;
};

/** Menu déroulant : clavier (↑ ↓ Entrée Échap), fermeture au clic extérieur */
export function Menu({
  trigger,
  items,
  align = "right",
  footer,
  className,
}: {
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => ReactNode;
  items: MenuItem[];
  align?: "left" | "right";
  footer?: (close: () => void) => ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setActive(enabled[0] ?? -1);
      list.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (i: number) => {
    const item = items[i];
    if (!item || item.disabled) return;
    setOpen(false);
    if (item.href) {
      if (item.external) window.open(item.href, "_blank", "noopener");
      else window.location.assign(item.href);
    }
    item.onSelect?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      root.current?.querySelector<HTMLElement>("[aria-haspopup]")?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const pos = enabled.indexOf(active);
      const next = e.key === "ArrowDown" ? enabled[(pos + 1) % enabled.length] : enabled[(pos - 1 + enabled.length) % enabled.length];
      setActive(next ?? -1);
    } else if (e.key === "Enter" || e.key === " ") {
      if (active >= 0) {
        e.preventDefault();
        choose(active);
      }
    }
  };

  return (
    <div ref={root} className={cn("relative", className)} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      {trigger({ open, toggle: () => setOpen((o) => !o), id })}
      {open && (
        <div
          ref={list}
          id={id}
          role="menu"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute top-full z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-bo-lg border border-bo-line bg-bo-surface p-1 shadow-bo-md outline-none",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              role={item.selected !== undefined ? "menuitemradio" : "menuitem"}
              aria-checked={item.selected}
              disabled={item.disabled}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-bo-sm px-2.5 py-2 text-left text-bo-body transition-colors disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
                item.danger ? "text-bo-ink-danger" : "text-bo-ink",
                i === active && (item.danger ? "bg-bo-danger-bg" : "bg-bo-subtle"),
                item.selected && "font-semibold"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
          {footer?.(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
