"use client";

import { forwardRef, useCallback, useEffect, useRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/bo/cn";

// 16px sous 1024px : en dessous, iOS zoome automatiquement sur le champ
const boxBase =
  "w-full rounded-bo-md border bg-bo-surface text-[16px] leading-5 lg:text-bo-body text-bo-ink placeholder:text-bo-ink-3 shadow-bo-xs transition-[border-color,box-shadow] outline-none focus-within:border-bo-focus focus-within:shadow-bo-focus";
const boxState = (invalid?: boolean, disabled?: boolean) =>
  cn(
    invalid ? "border-bo-line-danger focus-within:border-bo-line-danger focus-within:shadow-bo-focus-danger" : "border-bo-line-strong",
    disabled && "bg-bo-muted text-bo-ink-disabled shadow-none"
  );

export function Label({ htmlFor, children, hint, className }: { htmlFor?: string; children: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 flex items-baseline justify-between gap-2 text-bo-small font-medium text-bo-ink", className)}>
      <span>{children}</span>
      {hint && <span className="text-bo-caption font-normal text-bo-ink-3">{hint}</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-bo-small text-bo-ink-danger">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export function FieldHelp({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-bo-small text-bo-ink-3">{children}</p>;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  suffix?: ReactNode;
  invalid?: boolean;
  boxClassName?: string;
  size?: never;
  tall?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, suffix, invalid, disabled, className, boxClassName, tall, ...rest },
  ref
) {
  return (
    <div className={cn(boxBase, boxState(invalid, disabled), "flex items-center gap-2 px-3", tall ? "h-12" : "h-12 lg:h-[42px]", boxClassName)}>
      {icon && <span className="shrink-0 text-bo-icon [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn("h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-bo-ink-3 disabled:cursor-not-allowed", className)}
        {...rest}
      />
      {suffix && <span className="shrink-0 text-bo-ink-3">{suffix}</span>}
    </div>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; boxClassName?: string }>(
  function Select({ invalid, disabled, className, boxClassName, children, ...rest }, ref) {
    return (
      <div className={cn(boxBase, boxState(invalid, disabled), "relative h-12 lg:h-[42px]", boxClassName)}>
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn("h-full w-full appearance-none bg-transparent pl-3 pr-9 outline-none disabled:cursor-not-allowed", className)}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bo-icon" aria-hidden />
      </div>
    );
  }
);

/** Zone de texte qui s'agrandit avec son contenu (min 96px, pas de scroll interne) */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ invalid, disabled, className, onChange, value, ...rest }, forwardedRef) {
    const inner = useRef<HTMLTextAreaElement | null>(null);
    const resize = useCallback(() => {
      const el = inner.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.max(96, el.scrollHeight + 2)}px`;
    }, []);
    useEffect(resize, [value, resize]);

    return (
      <div className={cn(boxBase, boxState(invalid, disabled))}>
        <textarea
          ref={(el) => {
            inner.current = el;
            if (typeof forwardedRef === "function") forwardedRef(el);
            else if (forwardedRef) forwardedRef.current = el;
          }}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            resize();
          }}
          className={cn("block min-h-[96px] w-full resize-none overflow-hidden bg-transparent px-3 py-2.5 outline-none disabled:cursor-not-allowed", className)}
          {...rest}
        />
      </div>
    );
  }
);
