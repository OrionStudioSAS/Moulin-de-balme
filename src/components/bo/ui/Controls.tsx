"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/bo/cn";

export function Toggle({
  checked,
  onChange,
  disabled,
  label,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-bo-primary" : "bg-bo-line-strong"
      )}
    >
      <span
        className={cn("inline-block h-4 w-4 rounded-full bg-white shadow-bo-xs transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")}
        aria-hidden
      />
    </button>
  );
}

export function Checkbox({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-bo-sm border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "border-bo-primary bg-bo-primary text-bo-ink-inverse" : "border-bo-line-strong bg-bo-surface hover:border-bo-ink-3"
      )}
    >
      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
    </button>
  );
}

/** Contrôle segmenté (sélecteur de langue, filtres courts) */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  theme = "light",
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  theme?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex rounded-bo-md p-0.5",
        theme === "dark" ? "border border-bo-line-sidebar" : "bg-bo-muted",
        className
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-bo-sm px-3 py-1.5 text-bo-small font-medium transition-colors",
              theme === "dark"
                ? active
                  ? "bg-bo-sidebar-active text-bo-ink-sidebar"
                  : "text-bo-ink-sidebar-muted hover:text-bo-ink-sidebar"
                : active
                  ? "bg-bo-surface text-bo-ink shadow-bo-xs"
                  : "text-bo-ink-2 hover:text-bo-ink"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
