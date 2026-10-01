import Image from "next/image";
import type { ReactNode } from "react";
import { Wheat } from "lucide-react";
import { cn } from "@/lib/bo/cn";

export function initials(name: string) {
  const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-bo-accent-subtle text-bo-caption font-medium text-bo-ink-accent", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

/** Vignette produit : photo ou placeholder */
export function Thumb({ src, alt = "", size = 40, className }: { src?: string | null; alt?: string; size?: number; className?: string }) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-bo-md border border-bo-line bg-bo-muted text-bo-icon", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size * 2}px`} className="object-cover" />
      ) : (
        <Wheat className="h-[45%] w-[45%]" aria-hidden />
      )}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-bo-lg border border-bo-line bg-bo-surface", className)}>{children}</div>;
}

export function CardHeader({ title, meta, action, className }: { title: ReactNode; meta?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-bo-line px-5 py-4", className)}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-bo-card font-semibold text-bo-ink">{title}</div>
        {meta && <p className="mt-0.5 text-bo-small text-bo-ink-3">{meta}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, className }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-bo-serif text-bo-display-s lg:text-bo-display font-normal text-bo-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-bo-body text-bo-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      {icon && (
        <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-bo-muted text-bo-icon [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      )}
      <p className="text-bo-card font-semibold text-bo-ink">{title}</p>
      {description && <p className="max-w-sm text-bo-small text-bo-ink-2">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex h-16 items-center gap-4 border-b border-bo-line px-5 last:border-0">
          <span className="bo-skeleton h-10 w-10 shrink-0" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="bo-skeleton h-3 w-1/3" />
            <span className="bo-skeleton h-3 w-1/5" />
          </span>
          <span className="bo-skeleton hidden h-3 w-16 sm:block" />
          <span className="bo-skeleton h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
