"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { portalRoot, useMounted } from "@/lib/bo/portal";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { Button } from "./Button";

/** Modale de confirmation. Focus initial sur « Annuler » (action sûre). */
export function ConfirmModal({
  open,
  tone = "danger",
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  loading,
  error,
}: {
  open: boolean;
  tone?: "danger" | "neutral";
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const { t } = useBoI18n();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      prev?.focus?.();
    };
  }, [open, loading, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-bo-overlay/40" onClick={() => !loading && onClose()} aria-hidden />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bo-modal-title"
        className="relative w-full max-w-[440px] overflow-hidden rounded-bo-xl bg-bo-surface shadow-bo-lg"
      >
        <div className="px-6 pb-6 pt-6">
          <span
            className={cn(
              "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full",
              tone === "danger" ? "bg-bo-danger-bg text-bo-ink-danger" : "bg-bo-muted text-bo-icon"
            )}
          >
            {tone === "danger" ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          </span>
          <h2 id="bo-modal-title" className="text-bo-heading font-semibold text-bo-ink">
            {title}
          </h2>
          {description && <div className="mt-2 text-bo-body text-bo-ink-2">{description}</div>}
          {error && <p className="mt-3 text-bo-small text-bo-ink-danger">{error}</p>}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-bo-line bg-bo-subtle px-6 py-4 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onClose} disabled={loading} className="h-11 sm:h-9">
            {cancelLabel ?? t("common.cancel")}
          </Button>
          <Button variant={tone === "danger" ? "danger-solid" : "primary"} onClick={onConfirm} loading={loading} className="h-11 sm:h-9">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    portalRoot()
  );
}
