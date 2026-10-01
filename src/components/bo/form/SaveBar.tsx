"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";

/** Barre d'enregistrement : sticky en haut (desktop), collée au-dessus de la barre d'onglets (mobile) */
export function SaveBar({
  visible,
  saving,
  actionLabel,
  onSave,
  onCancel,
}: {
  visible: boolean;
  saving: boolean;
  actionLabel?: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useBoI18n();
  if (!visible && !saving) return null;

  return (
    <div
      className={cn(
        "z-40 flex h-[52px] items-center gap-3 rounded-bo-lg bg-bo-sidebar pl-4 pr-2 shadow-bo-md",
        "fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-4 lg:mb-2"
      )}
      role="region"
      aria-live="polite"
      aria-label={t("common.unsaved")}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-bo-accent" aria-hidden />
      <span className="flex-1 truncate text-bo-body font-medium text-bo-ink-sidebar">{saving ? t("common.saving") : t("common.unsaved")}</span>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="h-9 rounded-bo-md bg-bo-sidebar-active px-3.5 text-bo-body font-medium text-bo-ink-sidebar transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t("common.cancel")}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex h-9 items-center gap-1.5 rounded-bo-md bg-bo-surface px-3.5 text-bo-body font-semibold text-bo-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {actionLabel ?? t("common.save")}
      </button>
    </div>
  );
}
