"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ExternalLink, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { Category, Product, Subcategory, WeightPrice } from "@/types";
import { Badge } from "@/components/bo/ui/Badge";
import { Button, ButtonLink } from "@/components/bo/ui/Button";
import { Toggle } from "@/components/bo/ui/Controls";
import { FieldError, FieldHelp, Input, Label, Select, Textarea } from "@/components/bo/ui/Field";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { useToast } from "@/components/bo/ui/Toast";
import { MobileTopBar } from "@/components/bo/shell/MobileNav";
import { DatesField } from "@/components/bo/form/DatesField";
import { ImageField } from "@/components/bo/form/ImageField";
import { SaveBar } from "@/components/bo/form/SaveBar";
import { Section, ToggleRow } from "@/components/bo/form/Section";
import { useUnsavedGuard } from "@/components/bo/form/useUnsavedGuard";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

const priceText = (n: number | undefined) => (n === undefined || n === null ? "" : String(n).replace(".", ","));
const parsePrice = (s: string) => {
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};

type FormState = {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  image_url: string | null;
  price: string;
  poids: string;
  weight_prices: { weight: string; price: string }[];
  ingredients: string;
  conservation: string;
  savoir_faire: string;
  le_saviez_vous: string;
  is_available: boolean;
  is_featured: boolean;
  is_semaine: boolean;
  is_tranche: boolean;
  available_days: string[];
  category_id: string;
  subcategory_id: string;
  badge: string;
  sort_order: string;
};

function toForm(p?: Product): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    subtitle: p?.subtitle ?? "",
    description: p?.description ?? "",
    image_url: p?.image_url ?? null,
    price: p ? priceText(p.price) : "",
    poids: p?.poids ?? "",
    weight_prices: (Array.isArray(p?.weight_prices) ? p!.weight_prices : []).map((w: WeightPrice) => ({ weight: w.weight, price: priceText(w.price) })),
    ingredients: p?.ingredients ?? "",
    conservation: p?.conservation ?? "",
    savoir_faire: p?.savoir_faire ?? "",
    le_saviez_vous: p?.le_saviez_vous ?? "",
    is_available: p?.is_available ?? true,
    is_featured: p?.is_featured ?? false,
    is_semaine: p?.is_semaine ?? false,
    is_tranche: p?.is_tranche ?? false,
    available_days: p?.available_days ?? [],
    category_id: p?.category_id ?? "",
    subcategory_id: p?.subcategory_id ?? "",
    badge: p?.badge ?? "",
    sort_order: String(p?.sort_order ?? 0),
  };
}

export default function ProductEditor({
  product,
  categories,
  subcategories,
  today,
}: {
  product?: Product;
  categories: Category[];
  subcategories: Subcategory[];
  today: string;
}) {
  const { t } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const isNew = !product;

  const [initial, setInitial] = useState(() => toForm(product));
  const [form, setForm] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  const { modal: leaveModal } = useUnsavedGuard(dirty && !saving, t("form.leaveDescProduct"));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const errors = {
    name: !form.name.trim() ? t("products.nameRequired") : null,
    price: !form.price.trim() || Number.isNaN(parsePrice(form.price)) || parsePrice(form.price) < 0 ? t("products.priceRequired") : null,
  };
  const show = (k: keyof typeof errors) => (submitted || touched[k]) && errors[k];
  const errorCount = Object.values(errors).filter(Boolean).length;

  const save = async () => {
    setSubmitted(true);
    setServerError(null);
    if (errorCount > 0) {
      (errors.name ? nameRef : priceRef).current?.focus();
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const slug = slugify(form.slug || form.name);

    const { data: clash } = await supabase.from("products").select("id").eq("slug", slug).neq("id", product?.id ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
    if (clash) {
      setSaving(false);
      setServerError(t("products.slugTaken"));
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug,
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url,
      price: parsePrice(form.price),
      poids: form.poids.trim() || null,
      weight_prices: form.weight_prices
        .filter((w) => w.weight.trim())
        .map((w) => ({ weight: w.weight.trim(), price: parsePrice(w.price) || 0 })),
      ingredients: form.ingredients.trim() || null,
      conservation: form.conservation.trim() || null,
      savoir_faire: form.savoir_faire.trim() || null,
      le_saviez_vous: form.le_saviez_vous.trim() || null,
      is_available: form.is_available,
      is_featured: form.is_featured,
      is_semaine: form.is_semaine,
      is_tranche: form.is_tranche,
      available_days: [...form.available_days].sort(),
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      badge: form.badge || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    if (isNew) {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      setSaving(false);
      if (error || !data) {
        toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: save });
        return;
      }
      setInitial(form);
      toast({ tone: "success", message: t("products.created") });
      router.replace(`/admin/produits/${data.id}`);
      router.refresh();
      return;
    }

    const { error } = await supabase.from("products").update(payload).eq("id", product.id);
    setSaving(false);
    if (error) {
      toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: save });
      return;
    }
    const saved = { ...form, slug };
    setForm(saved);
    setInitial(saved);
    setSubmitted(false);
    toast({ tone: "success", message: t("common.saved") });
    router.refresh();
  };

  const remove = async () => {
    if (!product) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await createClient().from("products").delete().eq("id", product.id);
    setDeleting(false);
    if (error) return setDeleteError(t("common.errorGeneric"));
    setInitial(form);
    toast({ tone: "success", message: t("products.deleted") });
    router.push("/admin/produits");
    router.refresh();
  };

  const title = isNew ? t("products.newTitle") : initial.name;
  const subs = subcategories.filter((s) => s.category_id === form.category_id);
  const optional = <span className="font-normal text-bo-ink-3"> · {t("form.optional")}</span>;

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <SaveBar
        visible={dirty}
        saving={saving}
        actionLabel={isNew ? t("products.create") : undefined}
        onSave={save}
        onCancel={() => {
          setForm(initial);
          setSubmitted(false);
          setTouched({});
          setServerError(null);
        }}
      />

      <MobileTopBar variant="detail" title={t("products.title")} backHref="/admin/produits" />

      <div className="hidden lg:block">
        <Link href="/admin/produits" className="inline-flex items-center gap-1.5 text-bo-small text-bo-ink-2 hover:text-bo-ink">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("products.title")}
        </Link>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-bo-serif text-bo-display-s font-normal text-bo-ink lg:text-bo-display">{title}</h1>
          {!isNew && (
            <>
              <Badge tone={initial.is_available ? "success" : "neutral"} dot>
                {t(initial.is_available ? "products.available" : "products.unavailable")}
              </Badge>
              {initial.badge && <Badge tone="accent">{t(`products.badge${initial.badge.charAt(0).toUpperCase()}${initial.badge.slice(1)}` as never)}</Badge>}
            </>
          )}
        </div>
        {!isNew && (
          <div className="flex gap-2">
            <ButtonLink href={`/produits/${initial.slug}`} target="_blank" variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
              {t("products.viewInShop")}
            </ButtonLink>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
              {t("common.delete")}
            </Button>
          </div>
        )}
      </div>

      {submitted && errorCount > 0 && (
        <div role="alert" className="flex items-center gap-2 rounded-bo-md border border-bo-line-danger/30 bg-bo-danger-bg px-4 py-3 text-bo-body text-bo-ink-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {t("form.errorsSummary", { count: errorCount })}
        </div>
      )}
      {serverError && (
        <div role="alert" className="flex items-center gap-2 rounded-bo-md border border-bo-line-danger/30 bg-bo-danger-bg px-4 py-3 text-bo-body text-bo-ink-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex flex-col gap-5">
          <Section title={t("products.secInfo")}>
            <div>
              <Label htmlFor="name">
                {t("products.name")} <span className="text-bo-ink-danger">*</span>
              </Label>
              <Input
                ref={nameRef}
                id="name"
                value={form.name}
                placeholder={t("products.namePlaceholder")}
                invalid={!!show("name")}
                aria-describedby={show("name") ? "name-error" : undefined}
                onBlur={() => setTouched((x) => ({ ...x, name: true }))}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
                }}
              />
              <FieldError id="name-error">{show("name")}</FieldError>
            </div>
            <div>
              <Label htmlFor="subtitle">
                <span>
                  {t("products.subtitle")}
                  {optional}
                </span>
              </Label>
              <Input id="subtitle" value={form.subtitle} placeholder={t("products.subtitlePlaceholder")} onChange={(e) => set("subtitle", e.target.value)} />
              <FieldHelp>{t("products.subtitleHint")}</FieldHelp>
            </div>
            <div>
              <Label htmlFor="description">
                <span>
                  {t("products.description")}
                  {optional}
                </span>
              </Label>
              <Textarea id="description" value={form.description} placeholder={t("products.descriptionPlaceholder")} onChange={(e) => set("description", e.target.value)} />
            </div>
          </Section>

          <Section title={t("form.image")}>
            <ImageField value={form.image_url} onChange={(url) => set("image_url", url)} hint={t("products.imageHint")} />
          </Section>

          <Section title={t("products.secPrice")}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">
                  {t("products.price")} <span className="text-bo-ink-danger">*</span>
                </Label>
                <Input
                  ref={priceRef}
                  id="price"
                  inputMode="decimal"
                  value={form.price}
                  placeholder="0,00"
                  suffix="€"
                  invalid={!!show("price")}
                  aria-describedby={show("price") ? "price-error" : undefined}
                  onBlur={() => setTouched((x) => ({ ...x, price: true }))}
                  onChange={(e) => set("price", e.target.value.replace(/[^\d,.\s]/g, ""))}
                />
                <FieldError id="price-error">{show("price")}</FieldError>
              </div>
              <div>
                <Label htmlFor="poids">
                  <span>
                    {t("products.weight")}
                    {optional}
                  </span>
                </Label>
                <Input id="poids" value={form.poids} placeholder={t("products.weightPlaceholder")} onChange={(e) => set("poids", e.target.value)} />
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-bo-small font-medium text-bo-ink">{t("products.weightPrices")}</p>
                  <p className="mt-0.5 text-bo-small text-bo-ink-3">{t("products.weightPricesHint")}</p>
                </div>
                <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => set("weight_prices", [...form.weight_prices, { weight: "", price: "" }])}>
                  {t("products.addFormat")}
                </Button>
              </div>
              {form.weight_prices.length > 0 && (
                <div className="overflow-hidden rounded-bo-md border border-bo-line">
                  <div className="grid grid-cols-[minmax(0,1fr)_120px_40px] gap-3 bg-bo-subtle px-3 py-2 text-bo-caption font-medium text-bo-ink-2">
                    <span>{t("products.format")}</span>
                    <span>{t("products.price")}</span>
                    <span />
                  </div>
                  {form.weight_prices.map((w, i) => (
                    <div key={i} className="grid grid-cols-[minmax(0,1fr)_120px_40px] items-center gap-3 border-t border-bo-line px-3 py-2">
                      <Input
                        aria-label={t("products.format")}
                        value={w.weight}
                        placeholder="500 g"
                        onChange={(e) => set("weight_prices", form.weight_prices.map((x, j) => (j === i ? { ...x, weight: e.target.value } : x)))}
                      />
                      <Input
                        aria-label={t("products.price")}
                        inputMode="decimal"
                        value={w.price}
                        suffix="€"
                        onChange={(e) => set("weight_prices", form.weight_prices.map((x, j) => (j === i ? { ...x, price: e.target.value.replace(/[^\d,.\s]/g, "") } : x)))}
                      />
                      <Button variant="ghost" iconOnly icon={<Trash2 className="h-4 w-4" />} aria-label={t("products.removeFormat")} onClick={() => set("weight_prices", form.weight_prices.filter((_, j) => j !== i))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section title={t("products.secContent")} hint={t("products.secContentHint")}>
            {(
              [
                ["ingredients", "ingredients", "ingredientsPlaceholder", "ingredientsHint"],
                ["conservation", "conservation", "conservationPlaceholder", null],
                ["savoir_faire", "savoirFaire", "savoirFairePlaceholder", null],
                ["le_saviez_vous", "saviezVous", "saviezVousPlaceholder", null],
              ] as const
            ).map(([key, label, placeholder, hint]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  <span>
                    {t(`products.${label}`)}
                    {optional}
                  </span>
                </Label>
                <Textarea id={key} value={form[key]} placeholder={t(`products.${placeholder}`)} onChange={(e) => set(key, e.target.value)} />
                {hint && <FieldHelp>{t(`products.${hint}`)}</FieldHelp>}
              </div>
            ))}
          </Section>

          <Section title={t("form.seo")} hint={t("products.seoHint")}>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder={t("form.slugAuto")}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
              />
              <FieldHelp>{t("form.slugHint", { path: `/produits/${form.slug || "…"}` })}</FieldHelp>
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-20">
          <Section title={t("products.secStatus")}>
            {(
              [
                ["is_available", "isAvailable", "isAvailableHint"],
                ["is_featured", "isFeatured", "isFeaturedHint"],
                ["is_semaine", "isSemaine", "isSemaineHint"],
                ["is_tranche", "isTranche", "isTrancheHint"],
              ] as const
            ).map(([key, label, hint]) => (
              <ToggleRow key={key} label={t(`products.${label}`)} hint={t(`products.${hint}`)} control={<Toggle checked={form[key]} onChange={(v) => set(key, v)} label={t(`products.${label}`)} />} />
            ))}
          </Section>

          <Section title={t("products.salesDays")} hint={t("products.salesDaysHint")}>
            <DatesField value={form.available_days} onChange={(d) => set("available_days", d)} today={today} emptyHint={t("products.salesDaysEmpty")} />
          </Section>

          <Section title={t("products.secOrganisation")}>
            <div>
              <Label htmlFor="category">{t("products.category")}</Label>
              <Select id="category" value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value, subcategory_id: "" }))}>
                <option value="">{t("products.categoryPlaceholder")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">
                <span>
                  {t("products.subcategory")}
                  {optional}
                </span>
              </Label>
              <Select id="subcategory" value={form.subcategory_id} disabled={!form.category_id || subs.length === 0} onChange={(e) => set("subcategory_id", e.target.value)}>
                <option value="">{t("products.none")}</option>
                {subs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <FieldHelp>{t("products.subcategoryHint")}</FieldHelp>
            </div>
            <div>
              <Label htmlFor="badge">
                <span>
                  {t("products.badge")}
                  {optional}
                </span>
              </Label>
              <Select id="badge" value={form.badge} onChange={(e) => set("badge", e.target.value)}>
                <option value="">{t("products.badgeNone")}</option>
                <option value="nouveau">{t("products.badgeNouveau")}</option>
                <option value="bestseller">{t("products.badgeBestseller")}</option>
                <option value="exclusif">{t("products.badgeExclusif")}</option>
              </Select>
              <FieldHelp>{t("products.badgeHint")}</FieldHelp>
            </div>
            <div>
              <Label htmlFor="sort">{t("form.sortOrder")}</Label>
              <Input id="sort" type="number" inputMode="numeric" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
              <FieldHelp>{t("form.sortOrderHint")}</FieldHelp>
            </div>
          </Section>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title={t("products.deleteTitle", { name: initial.name })}
        description={t("products.deleteDesc")}
        confirmLabel={t("products.deleteConfirm")}
        loading={deleting}
        error={deleteError}
        onConfirm={remove}
        onClose={() => {
          setConfirmDelete(false);
          setDeleteError(null);
        }}
      />
      {leaveModal}
    </div>
  );
}
