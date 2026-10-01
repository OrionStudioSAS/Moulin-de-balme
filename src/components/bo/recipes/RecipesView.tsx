"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Clock, ExternalLink, Filter, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { categoryLabel, difficultyOf, RECIPE_CATEGORIES } from "@/lib/bo/recipes";
import type { Recipe } from "@/types";
import { Badge } from "@/components/bo/ui/Badge";
import { Button, ButtonLink } from "@/components/bo/ui/Button";
import { Card, EmptyState, PageHeader, Thumb } from "@/components/bo/ui/Display";
import { Input } from "@/components/bo/ui/Field";
import { Menu } from "@/components/bo/ui/Menu";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { Pills, Tabs, type TabItem } from "@/components/bo/ui/Tabs";
import { useToast } from "@/components/bo/ui/Toast";

export function DifficultyBars({ value }: { value: string }) {
  const { t } = useBoI18n();
  const d = difficultyOf(value);
  return (
    <span className="inline-flex items-center gap-1.5 text-bo-body text-bo-ink-2">
      <span className="inline-flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn("w-[3px] rounded-sm", (d?.level ?? 0) >= n ? "bg-bo-ink" : "bg-bo-line-strong")} style={{ height: 4 + n * 3 }} />
        ))}
      </span>
      {d ? t(d.label) : value}
    </span>
  );
}

export default function RecipesView({ recipes: initial }: { recipes: Recipe[] }) {
  const { t } = useBoI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const toast = useToast();
  const [recipes, setRecipes] = useState(initial);
  useEffect(() => setRecipes(initial), [initial]);

  const tab = sp.get("statut") ?? "";
  const q = sp.get("q") ?? "";
  const cat = sp.get("categorie") ?? "";
  const [search, setSearch] = useState(q);
  const [toDelete, setToDelete] = useState<Recipe | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const setParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (search === q) return;
    const id = setTimeout(() => setParams({ q: search.trim() || null }), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const base = useMemo(
    () => recipes.filter((r) => (!q || r.title.toLowerCase().includes(q.toLowerCase())) && (!cat || r.category === cat)),
    [recipes, q, cat]
  );
  const visible = base.filter((r) => (tab === "publiees" ? r.is_published : tab === "brouillons" ? !r.is_published : true));
  const published = recipes.filter((r) => r.is_published).length;

  const tabs: TabItem[] = [
    { key: "", label: t("recipes.all"), count: base.length, onClick: () => setParams({ statut: null }) },
    { key: "publiees", label: t("recipes.tabPublished"), count: base.filter((r) => r.is_published).length, onClick: () => setParams({ statut: "publiees" }) },
    { key: "brouillons", label: t("recipes.tabDrafts"), count: base.filter((r) => !r.is_published).length, onClick: () => setParams({ statut: "brouillons" }) },
  ];

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await createClient().from("recipes").delete().eq("id", toDelete.id);
    setDeleting(false);
    if (error) return setDeleteError(t("common.errorGeneric"));
    setRecipes((list) => list.filter((r) => r.id !== toDelete.id));
    setToDelete(null);
    toast({ tone: "success", message: t("recipes.deleted") });
    router.refresh();
  };

  const empty =
    recipes.length === 0 ? (
      <EmptyState icon={<BookOpen />} title={t("recipes.emptyList")} description={t("recipes.emptyListDesc")} action={<ButtonLink href="/admin/recettes/new" variant="primary" icon={<Plus className="h-4 w-4" />}>{t("recipes.new")}</ButtonLink>} />
    ) : q || cat ? (
      <EmptyState
        icon={<Search />}
        title={t("recipes.emptySearch")}
        description={t("recipes.emptySearchDesc")}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setParams({ q: null, categorie: null });
            }}
          >
            {t("common.clearSearch")}
          </Button>
        }
      />
    ) : (
      <EmptyState icon={<BookOpen />} title={t("recipes.emptyDrafts")} description={t("recipes.emptyDraftsDesc")} />
    );

  const open = (r: Recipe) => router.push(`/admin/recettes/${r.id}/edit`);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title={t("recipes.title")} subtitle={`${t("recipes.count", { count: recipes.length })} · ${t("recipes.published", { count: published })}`} />
        <ButtonLink href="/admin/recettes/new" variant="primary" icon={<Plus className="h-4 w-4" />} className="hidden lg:inline-flex">
          {t("recipes.new")}
        </ButtonLink>
        <ButtonLink href="/admin/recettes/new" variant="primary" iconOnly icon={<Plus className="h-5 w-5" />} aria-label={t("recipes.new")} className="h-10 w-10 lg:hidden" />
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Input type="search" icon={<Search />} placeholder={t("recipes.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <Pills items={tabs} active={tab} />
        <Card className="overflow-hidden">
          {visible.length === 0
            ? empty
            : visible.map((r) => (
                <button key={r.id} type="button" onClick={() => open(r)} className="flex w-full items-center gap-3 border-b border-bo-line px-3 py-3 text-left last:border-0">
                  <Thumb src={r.image_url} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-bo-body font-medium text-bo-ink">{r.title}</span>
                    <span className="block truncate text-bo-small text-bo-ink-3">{[categoryLabel(r.category) ? t(categoryLabel(r.category)!) : r.category, r.total_time].filter(Boolean).join(" · ")}</span>
                  </span>
                  <Badge tone={r.is_published ? "success" : "neutral"} dot>
                    {t(r.is_published ? "recipes.statusPublished" : "recipes.statusDraft")}
                  </Badge>
                </button>
              ))}
        </Card>
      </div>

      {/* Desktop */}
      <Card className="hidden lg:block">
        <Tabs items={tabs} active={tab} />
        <div className="flex flex-wrap items-center gap-2 border-b border-bo-line px-4 py-3">
          <Input type="search" icon={<Search />} placeholder={t("recipes.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} boxClassName="w-[320px] lg:h-9" />
          <Menu
            align="left"
            trigger={({ open: isOpen, toggle, id }) => (
              <Button variant="secondary" icon={<Filter className="h-4 w-4" />} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={id} onClick={toggle} className={cn(cat && "border-bo-focus bg-bo-accent-subtle")}>
                {t("recipes.categoryFilter", { value: categoryLabel(cat) ? t(categoryLabel(cat)!) : t("recipes.categoryAll") })}
              </Button>
            )}
            items={[
              { key: "", label: t("recipes.categoryAll"), selected: !cat, onSelect: () => setParams({ categorie: null }) },
              ...RECIPE_CATEGORIES.map((c) => ({ key: c.value, label: t(c.label), selected: cat === c.value, onSelect: () => setParams({ categorie: c.value }) })),
            ]}
          />
        </div>
        {visible.length === 0 ? (
          empty
        ) : (
          <>
            <div className="grid grid-cols-[minmax(0,1fr)_120px_130px_190px_110px_84px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2">
              <span>{t("recipes.colRecipe")}</span>
              <span>{t("recipes.colCategory")}</span>
              <span>{t("recipes.colDifficulty")}</span>
              <span>{t("recipes.colTime")}</span>
              <span>{t("recipes.colStatus")}</span>
              <span />
            </div>
            {visible.map((r) => (
              <div
                key={r.id}
                role="link"
                tabIndex={0}
                onClick={() => open(r)}
                onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && open(r)}
                className="grid min-h-[64px] cursor-pointer grid-cols-[minmax(0,1fr)_120px_130px_190px_110px_84px] items-center gap-4 border-b border-bo-line px-5 py-2.5 transition-colors last:border-0 hover:bg-bo-subtle"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Thumb src={r.image_url} />
                  <span className="min-w-0">
                    <span className="block truncate text-bo-body font-medium text-bo-ink">{r.title}</span>
                    <span className="block truncate text-bo-small text-bo-ink-3">/recettes/{r.slug}</span>
                  </span>
                </span>
                <span className="truncate text-bo-body text-bo-ink-2">{categoryLabel(r.category) ? t(categoryLabel(r.category)!) : r.category}</span>
                <DifficultyBars value={r.difficulty} />
                <span className="flex min-w-0 items-center gap-1.5 text-bo-body text-bo-ink-2">
                  <Clock className="h-4 w-4 shrink-0 text-bo-icon" aria-hidden />
                  <span className="truncate">{r.total_time ?? "—"}</span>
                </span>
                <span>
                  <Badge tone={r.is_published ? "success" : "neutral"} dot>
                    {t(r.is_published ? "recipes.statusPublished" : "recipes.statusDraft")}
                  </Badge>
                </span>
                <span className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  {r.is_published ? (
                    <ButtonLink href={`/recettes/${r.slug}`} target="_blank" variant="ghost" iconOnly icon={<ExternalLink className="h-4 w-4" />} aria-label={t("recipes.openPublished")} />
                  ) : (
                    <Button variant="ghost" iconOnly icon={<ExternalLink className="h-4 w-4" />} aria-label={t("recipes.draftNoLink")} title={t("recipes.draftNoLink")} disabled />
                  )}
                  <Menu
                    trigger={({ open: isOpen, toggle, id }) => (
                      <Button variant="ghost" iconOnly icon={<MoreHorizontal className="h-4 w-4" />} aria-label={t("products.actions", { name: r.title })} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={id} onClick={toggle} />
                    )}
                    items={[
                      { key: "edit", label: t("common.edit"), icon: <Pencil />, href: `/admin/recettes/${r.id}/edit` },
                      { key: "view", label: t("recipes.viewOnSite"), icon: <ExternalLink />, href: `/recettes/${r.slug}`, external: true, disabled: !r.is_published },
                      { key: "delete", label: t("common.delete"), icon: <Trash2 />, danger: true, onSelect: () => setToDelete(r) },
                    ]}
                  />
                </span>
              </div>
            ))}
          </>
        )}
      </Card>

      <ConfirmModal
        open={!!toDelete}
        title={t("recipes.deleteTitle", { name: toDelete?.title ?? "" })}
        description={t("recipes.deleteDesc")}
        confirmLabel={t("recipes.deleteConfirm")}
        loading={deleting}
        error={deleteError}
        onConfirm={remove}
        onClose={() => {
          setToDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
