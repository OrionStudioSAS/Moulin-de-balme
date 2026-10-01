"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { ConfirmModal } from "@/components/bo/ui/Modal";

/**
 * Bloque la navigation quand des modifications ne sont pas enregistrées :
 * liens internes (sidebar, retour…) → modale ; fermeture d'onglet → beforeunload natif.
 */
export function useUnsavedGuard(dirty: boolean, description: string) {
  const { t } = useBoI18n();
  const router = useRouter();
  const [pending, setPending] = useState<(() => void) | null>(null);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      e.preventDefault();
      e.stopPropagation();
      setPending(() => () => router.push(url.pathname + url.search + url.hash));
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, router]);

  /** À utiliser pour les navigations programmatiques (bouton retour, changement d'élément) */
  const guard = useCallback((action: () => void) => {
    if (dirtyRef.current) setPending(() => action);
    else action();
  }, []);

  const modal = (
    <ConfirmModal
      open={!!pending}
      tone="neutral"
      title={t("form.leaveTitle")}
      description={description}
      cancelLabel={t("form.keepEditing")}
      confirmLabel={t("form.leave")}
      onClose={() => setPending(null)}
      onConfirm={() => {
        const action = pending;
        dirtyRef.current = false;
        setPending(null);
        action?.();
      }}
    />
  );

  return { guard, modal };
}
