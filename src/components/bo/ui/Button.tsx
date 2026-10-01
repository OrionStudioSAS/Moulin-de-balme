import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/bo/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-solid";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-bo-md text-bo-body font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-bo-primary text-bo-ink-inverse hover:bg-bo-primary-hover",
  secondary: "bg-bo-surface text-bo-ink border border-bo-line-strong shadow-bo-xs hover:bg-bo-subtle",
  ghost: "text-bo-ink hover:bg-bo-subtle",
  danger: "bg-bo-surface text-bo-ink-danger border border-bo-line-strong shadow-bo-xs hover:bg-bo-danger-bg",
  "danger-solid": "bg-bo-danger text-bo-ink-inverse hover:opacity-90",
};

const sizes: Record<ButtonSize, { text: string; icon: string }> = {
  md: { text: "h-9 px-3.5", icon: "h-9 w-9" },
  lg: { text: "h-12 px-5", icon: "h-12 w-12" },
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
};

export function buttonClass({ variant = "secondary", size = "md", iconOnly = false, className }: Common & { className?: string }) {
  return cn(base, variants[variant], iconOnly ? sizes[size].icon : sizes[size].text, className);
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant, size, icon, iconOnly, loading, className, children, type = "button", disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={buttonClass({ variant, size, iconOnly, className })}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {!iconOnly && children}
    </button>
  );
});

export function ButtonLink({
  variant,
  size,
  icon,
  iconOnly,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass({ variant, size, iconOnly, className })} {...rest}>
      {icon}
      {!iconOnly && children}
    </Link>
  );
}
