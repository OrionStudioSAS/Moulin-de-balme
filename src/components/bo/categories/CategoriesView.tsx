"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ExternalLink, LayoutGrid, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { Category, Subcategory } from "@/types";
import { Button, ButtonLink } from "@/components/bo/ui/Button";
import { Card, PageHeader, Thumb } from "@/components/bo/ui/Display";
import { FieldHelp, Input, Label, Textarea } from "@/components/bo/ui/Field";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { useToast } from "@/components/bo/ui/Toast";
import { MobileTopBar } from "@/components/bo/shell/MobileNav";
import { ImageTile } from "@/components/bo/form/ImageField";
import { SaveBar } from "@/components/bo/form/SaveBar";
import { Section } from "@/components/bo/form/Section";
import { useUnsavedGuard } from "@/components/bo/form/useUnsavedGuard";
import NewCategoryModal from "./NewCategoryModal";

export const ALL_SLUG = "tous-les-produits";

export type DefaultBanner = { title?: string; subtitle?: string; description?: string; banner_image_url?: string | null };
type Sub = { id: string; name: string; isNew?: boolean };

export default function CategoriesView({
  categories,
  subcategories,
  productCounts,
  defaultBanner,
  selected,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  productCounts: Record<string, number>;
  defaultBanner: DefaultBanner;
  selected: string | null;
}) {
  const { t } = useBoI18n();
  const [creating, setCreating] = useState(false);
  const current = selected ?? ALL_SLUG;
  const category = categories.find((c) => c.slug === current) ?? null;

  const itemCls = (active: boolean) =>
    cn("flex items-center gap-3 rounded-bo-md px-2.5 py-2 transition-colors", active ? "bg-bo-accent-subtle" : "hover:bg-bo-subtle");

  const list = (
    <Card className="p-2 lg:self-start">
      <p className="px-2.5 pb-1.5 pt-2 text-bo-caption text-bo-ink-3">{t("categories.pageGroup")}</p>
      <Link href={`/admin/categories/${ALL_SLUG}`} className={cn(itemCls(selected === ALL_SLUG), !selected && "lg:bg-bo-accent-subtle")}>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-bo-md border border-bo-line bg-bo-muted text-bo-icon">
          <LayoutGrid className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-bo-body font-medium text-bo-ink">{t("categories.allProducts")}</span>
          <span className="block truncate text-bo-small text-bo-ink-3">{t("categories.defaultBanner")}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
      </Link>
      <p className="px-2.5 pb-1.5 pt-4 text-bo-caption text-bo-ink-3">{t("categories.listGroup")}</p>
      {categories.map((c) => (
        <Link key={c.id} href={`/admin/categories/${c.slug}`} className={itemCls(c.slug === current)} aria-current={c.slug === current ? "page" : undefined}>
          <Thumb src={c.image_url} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-bo-body font-medium text-bo-ink">{c.name}</span>
            <span className="block truncate text-bo-small text-bo-ink-3">/{c.slug}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />
        </Link>
      ))}
    </Card>
  );

  const detail = category ? (
    <CategoryEditor
      key={category.id}
      category={category}
      subcategories={subcategories.filter((s) => s.category_id === category.id).sort((a, b) => a.sort_order - b.sort_order)}
      productCount={productCounts[category.id] ?? 0}
    />
  ) : (
    <DefaultBannerEditor key="default" banner={defaultBanner} />
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile : liste OU détail */}
      <div className="lg:hidden">
        {selected ? (
          <>
            <MobileTopBar variant="detail" title={t("categories.title")} backHref="/admin/categories" />
            {detail}
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <PageHeader title={t("categories.title")} />
              <Button variant="primary" iconOnly icon={<Plus className="h-5 w-5" />} aria-label={t("categories.new")} className="h-10 w-10" onClick={() => setCreating(true)} />
            </div>
            {list}
          </div>
        )}
      </div>

      {/* Desktop : liste + détail */}
      <div className="hidden flex-col gap-6 lg:flex">
        <PageHeader
          title={t("categories.title")}
          subtitle={t("categories.subtitle")}
          actions={
            <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>
              {t("categories.new")}
            </Button>
          }
        />
        <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-5">
          {list}
          <div className="min-w-0">{detail}</div>
        </div>
      </div>

      <NewCategoryModal open={creating} onClose={() => setCreating(false)} categories={categories} />
    </div>
  );
}

function useCategoryForm<T>(initialValue: T) {
  const [initial, setInitial] = useState(initialValue);
  const [form, setForm] = useState(initialValue);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  return { initial, setInitial, form, setForm, dirty };
}

function CategoryEditor({ category, subcategories, productCount }: { category: Category; subcategories: Subcategory[]; productCount: number }) {
  const { t } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const { initial, setInitial, form, setForm, dirty } = useCategoryForm({
    image_url: category.image_url,
    banner_image_url: category.banner_image_url,
    banner_title: category.banner_title ?? "",
    banner_subtitle: category.banner_subtitle ?? "",
    banner_description: category.banner_description ?? "",
    subs: subcategories.map((s) => ({ id: s.id, name: s.name })) as Sub[],
  });
  const [newSub, setNewSub] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const subInput = useRef<HTMLInputElement>(null);
  const { modal } = useUnsavedGuard(dirty && !saving, t("form.leaveDescCategory"));

  const addSub = () => {
    const name = newSub.trim();
    if (!name || form.subs.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setForm((f) => ({ ...f, subs: [...f.subs, { id: `new-${Date.now()}`, name, isNew: true }] }));
    setNewSub("");
    subInput.current?.focus();
  };

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");
    const removed = initial.subs.filter((s) => !form.subs.some((x) => x.id === s.id)).map((s) => s.id);
    const added = form.subs.filter((s) => s.isNew);

    const results = await Promise.all([
      supabase
        .from("categories")
        .update({
          image_url: form.image_url,
          banner_image_url: form.banner_image_url,
          banner_title: form.banner_title.trim() || null,
          banner_subtitle: form.banner_subtitle.trim() || null,
          banner_description: form.banner_description.trim() || null,
        })
        .eq("id", category.id),
      removed.length
        ? supabase
            .from("products")
            .update({ subcategory_id: null })
            .in("subcategory_id", removed)
            .then(() => supabase.from("subcategories").delete().in("id", removed))
        : Promise.resolve({ error: null }),
      added.length
        ? supabase
            .from("subcategories")
            .insert(added.map((s, i) => ({ category_id: category.id, name: s.name, slug: slugify(s.name), sort_order: form.subs.length - added.length + i })))
        : Promise.resolve({ error: null }),
    ]);
    setSaving(false);

    if (results.some((r) => r.error)) {
      toast({ tone: "error", message: t("categories.saveError"), actionLabel: t("common.retry"), onAction: save, persistent: true });
      router.refresh();
      return;
    }
    setInitial(form);
    toast({ tone: "success", message: t("common.saved") });
    router.refresh();
  };

  const remove = async () => {
    setDeleting(true);
    setDeleteError(null);
    const supabase = createClient();
    const { error: e1 } = await supabase.from("products").update({ category_id: null, subcategory_id: null }).eq("category_id", category.id);
    const { error: e2 } = e1 ? { error: e1 } : await supabase.from("subcategories").delete().eq("category_id", category.id);
    const { error: e3 } = e2 ? { error: e2 } : await supabase.from("categories").delete().eq("id", category.id);
    setDeleting(false);
    if (e3) return setDeleteError(t("common.errorGeneric"));
    setInitial(form);
    toast({ tone: "success", message: t("categories.deleted") });
    router.push("/admin/categories");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <SaveBar visible={dirty} saving={saving} onSave={save} onCancel={() => setForm(initial)} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-bo-serif text-bo-display-s font-normal text-bo-ink">{category.name}</h2>
          <span className="rounded-bo-sm bg-bo-muted px-1.5 py-0.5 text-bo-caption text-bo-ink-2">/{category.slug}</span>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/produits?categorie=${category.slug}`} target="_blank" variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
            {t("products.viewInShop")}
          </ButtonLink>
          <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <Section title={t("categories.secVisuals")} hint={t("categories.secVisualsHint")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
          <ImageTile
            label={t("categories.thumb")}
            hint={t("categories.thumbHint")}
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            emptyLabel={t("categories.addThumb")}
            dropHint={t("categories.dropHint")}
            frameClassName="aspect-[3/4] w-[160px]"
          />
          <ImageTile
            label={t("categories.banner")}
            hint={t("categories.bannerHint")}
            value={form.banner_image_url}
            onChange={(url) => setForm((f) => ({ ...f, banner_image_url: url }))}
            emptyLabel={t("categories.addBanner")}
            dropHint={t("categories.dropHint")}
            frameClassName="aspect-[16/7] w-full sm:aspect-auto sm:h-[213px]"
          />
        </div>
      </Section>

      <BannerTexts
        placeholderTitle={category.name}
        title={form.banner_title}
        subtitle={form.banner_subtitle}
        description={form.banner_description}
        onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
      />

      <Section title={t("categories.secSubs")} hint={t("categories.secSubsHint")}>
        {form.subs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {form.subs.map((s) => (
              <span key={s.id} className="inline-flex h-7 items-center gap-1 rounded-full border border-bo-line-strong bg-bo-surface pl-2.5 pr-1 text-bo-small font-medium text-bo-ink">
                {s.name}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, subs: f.subs.filter((x) => x.id !== s.id) }))}
                  aria-label={t("categories.removeSub", { name: s.name })}
                  className="rounded-full p-0.5 text-bo-icon hover:bg-bo-muted hover:text-bo-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-bo-small text-bo-ink-3">{t("categories.noSubs")}</p>
        )}
        <div className="flex gap-2">
          <Input
            ref={subInput}
            icon={<Plus />}
            placeholder={t("categories.newSub")}
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSub();
              }
            }}
            boxClassName="flex-1"
          />
          <Button variant="secondary" onClick={addSub} disabled={!newSub.trim()} className="h-12 lg:h-[42px]">
            {t("categories.addSub")}
          </Button>
        </div>
      </Section>

      <ConfirmModal
        open={confirmDelete}
        title={t("categories.deleteTitle", { name: category.name })}
        description={productCount > 0 ? t("categories.deleteDesc", { count: productCount }) : t("categories.deleteDescEmpty")}
        confirmLabel={t("categories.deleteConfirm")}
        loading={deleting}
        error={deleteError}
        onConfirm={remove}
        onClose={() => {
          setConfirmDelete(false);
          setDeleteError(null);
        }}
      />
      {modal}
    </div>
  );
}

function BannerTexts({
  placeholderTitle,
  title,
  subtitle,
  description,
  onChange,
}: {
  placeholderTitle: string;
  title: string;
  subtitle: string;
  description: string;
  onChange: (patch: { banner_title?: string; banner_subtitle?: string; banner_description?: string }) => void;
}) {
  const { t } = useBoI18n();
  const optional = <span className="font-normal text-bo-ink-3"> · {t("form.optional")}</span>;
  return (
    <Section title={t("categories.secTexts")} hint={t("categories.secTextsHint")}>
      <div>
        <Label htmlFor="banner_title">
          <span>
            {t("categories.bannerTitle")}
            {optional}
          </span>
        </Label>
        <Input id="banner_title" value={title} placeholder={placeholderTitle} onChange={(e) => onChange({ banner_title: e.target.value })} />
        <FieldHelp>{t("categories.bannerTitleHint")}</FieldHelp>
      </div>
      <div>
        <Label htmlFor="banner_subtitle">
          <span>
            {t("categories.bannerSubtitle")}
            {optional}
          </span>
        </Label>
        <Input id="banner_subtitle" value={subtitle} onChange={(e) => onChange({ banner_subtitle: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="banner_description">
          <span>
            {t("categories.bannerDescription")}
            {optional}
          </span>
        </Label>
        <Textarea id="banner_description" value={description} placeholder={t("categories.bannerDescriptionPlaceholder")} onChange={(e) => onChange({ banner_description: e.target.value })} />
      </div>
    </Section>
  );
}

/** « Tous les produits » : bannière par défaut (image + textes), ni vignette ni sous-catégories, non supprimable */
function DefaultBannerEditor({ banner }: { banner: DefaultBanner }) {
  const { t } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const { initial, setInitial, form, setForm, dirty } = useCategoryForm({
    banner_image_url: banner.banner_image_url ?? null,
    banner_title: banner.title ?? "",
    banner_subtitle: banner.subtitle ?? "",
    banner_description: banner.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const { modal } = useUnsavedGuard(dirty && !saving, t("form.leaveDescCategory"));

  const save = async () => {
    setSaving(true);
    const { error } = await createClient()
      .from("site_settings")
      .upsert({
        key: "products_banner",
        value: { title: form.banner_title.trim(), subtitle: form.banner_subtitle.trim(), description: form.banner_description.trim(), banner_image_url: form.banner_image_url },
      });
    setSaving(false);
    if (error) {
      toast({ tone: "error", message: t("categories.saveError"), actionLabel: t("common.retry"), onAction: save, persistent: true });
      return;
    }
    setInitial(form);
    toast({ tone: "success", message: t("common.saved") });
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <SaveBar visible={dirty} saving={saving} onSave={save} onCancel={() => setForm(initial)} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-bo-serif text-bo-display-s font-normal text-bo-ink">{t("categories.allProducts")}</h2>
          <span className="rounded-bo-sm bg-bo-muted px-1.5 py-0.5 text-bo-caption text-bo-ink-2">/produits</span>
        </div>
        <ButtonLink href="/produits" target="_blank" variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
          {t("products.viewInShop")}
        </ButtonLink>
      </div>
      <Section title={t("categories.banner")} hint={t("categories.bannerHint")}>
        <ImageTile
          label={t("categories.banner")}
          hint={t("categories.dropHint")}
          value={form.banner_image_url}
          onChange={(url) => setForm((f) => ({ ...f, banner_image_url: url }))}
          emptyLabel={t("categories.addBanner")}
          dropHint={t("categories.dropHint")}
          frameClassName="aspect-[16/5] w-full"
        />
      </Section>
      <BannerTexts
        placeholderTitle={t("products.title")}
        title={form.banner_title}
        subtitle={form.banner_subtitle}
        description={form.banner_description}
        onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
      />
      {modal}
    </div>
  );
}

