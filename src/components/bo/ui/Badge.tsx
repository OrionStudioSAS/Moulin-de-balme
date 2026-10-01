import type { ReactNode } from "react";
import { cn } from "@/lib/bo/cn";

export type Tone = "success" | "info" | "warning" | "danger" | "neutral" | "accent";

const tones: Record<Tone, string> = {
  success: "bg-bo-success-bg text-bo-success",
  info: "bg-bo-info-bg text-bo-info",
  warning: "bg-bo-warning-bg text-bo-warning",
  danger: "bg-bo-danger-bg text-bo-danger",
  neutral: "bg-bo-neutral-bg text-bo-neutral",
  accent: "bg-bo-accent-subtle text-bo-ink-accent",
};

export function Badge({ tone = "neutral", dot = false, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-bo-caption font-medium whitespace-nowrap", tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export const ORDER_STATUS_TONE: Record<string, Tone> = {
  pending: "warning",
  confirmed: "info",
  ready: "success",
  completed: "accent",
  cancelled: "neutral",
};

export type ChipColor = "green" | "blue" | "brown" | "red" | "cream";

export const chipClass: Record<ChipColor, string> = {
  green: "bg-bo-chip-green-bg text-bo-chip-green",
  blue: "bg-bo-chip-blue-bg text-bo-chip-blue",
  brown: "bg-bo-chip-brown-bg text-bo-chip-brown",
  red: "bg-bo-chip-red-bg text-bo-chip-red",
  cream: "bg-bo-chip-cream-bg text-bo-chip-cream border border-bo-chip-cream-line",
};

export function Chip({ color = "green", children }: { color?: ChipColor; children: ReactNode }) {
  return (
    <span className={cn("inline-flex h-5 items-center rounded-full px-2.5 text-bo-caption font-medium whitespace-nowrap", chipClass[color] ?? chipClass.green)}>
      {children}
    </span>
  );
}

/** Pastille de compteur (onglets, menu) */
export function Count({ value, active = false, accent = false }: { value: number | string; active?: boolean; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] min-w-[22px] items-center justify-center rounded-full px-2 text-bo-caption font-medium tabular-nums",
        accent ? "bg-bo-accent text-bo-ink" : active ? "bg-bo-primary text-bo-ink-inverse" : "bg-bo-neutral-bg text-bo-neutral"
      )}
    >
      {value}
    </span>
  );
}
