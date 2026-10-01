"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Info, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { portalRoot, useMounted } from "@/lib/bo/portal";
import type { Category } from "@/types";
import { Button } from "@/components/bo/ui/Button";
import { FieldError, FieldHelp, Input, Label } from "@/components/bo/ui/Field";
import { useToast } from "@/components/bo/ui/Toast";
import { slugify } from "@/components/bo/products/ProductEditor";

export default function NewCategoryModal({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: Category[] }) {
  const { t } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const mounted = useMounted();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setSlug("");
    setSlugTouched(false);
    setSubmitted(false);
    setServerError(null);
    setTimeout(() => nameRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const finalSlug = slugify(slug || name);
  const clash = categories.find((c) => c.slug === finalSlug);
  const nameError = submitted && !name.trim() ? t("categories.nameRequired") : null;
  const slugError = submitted && name.trim() && clash ? t("categories.slugTaken", { name: clash.name }) : null;

  const create = async () => {
    setSubmitted(true);
    setServerError(null);
    if (!name.trim()) return nameRef.current?.focus();
    if (clash) return;
    setSaving(true);
    const sortOrder = Math.max(0, ...categories.map((c) => c.sort_order)) + 1;
    const { error } = await createClient().from("categories").insert({ name: name.trim(), slug: finalSlug, sort_order: sortOrder });
    setSaving(false);
    if (error) return setServerError(t("common.errorGeneric"));
    onClose();
    toast({ tone: "success", message: t("categories.created") });
    router.push(`/admin/categories/${finalSlug}`);
    router.refresh();
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-bo-overlay/40" onClick={onClose} aria-hidden />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-cat-title"
        onSubmit={(e) => {
          e.preventDefault();
          create();
        }}
        className="relative w-full max-w-[480px] overflow-hidden rounded-bo-xl bg-bo-surface shadow-bo-lg"
        noValidate
      >
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="flex-1">
            <h2 id="new-cat-title" className="text-bo-heading font-semibold text-bo-ink">
              {t("categories.newTitle")}
            </h2>
            <p className="mt-1 text-bo-body text-bo-ink-2">{t("categories.newDesc")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("common.close")} className="rounded-bo-sm p-1 text-bo-icon hover:text-bo-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5">
          <div>
            <Label htmlFor="cat-name">
              {t("categories.name")} <span className="text-bo-ink-danger">*</span>
            </Label>
            <Input
              ref={nameRef}
              id="cat-name"
              value={name}
              invalid={!!nameError}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
            <FieldError>{nameError}</FieldError>
          </div>
          <div>
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              value={slug}
              invalid={!!slugError}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              }}
            />
            {slugError ? <FieldError>{slugError}</FieldError> : <FieldHelp>{t("categories.slugHelp", { slug: finalSlug || "…" })}</FieldHelp>}
          </div>
          <p className="flex items-start gap-2 rounded-bo-md bg-bo-subtle p-3 text-bo-small text-bo-ink-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-bo-icon" aria-hidden />
            {t("categories.newInfo")}
          </p>
          {serverError && <p className="text-bo-small text-bo-ink-danger">{serverError}</p>}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-bo-line bg-bo-subtle px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} className="h-11 sm:h-9">
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={saving} className="h-11 sm:h-9">
            {t("categories.create")}
          </Button>
        </div>
      </form>
    </div>,
    portalRoot()
  );
}
