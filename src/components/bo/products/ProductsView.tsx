"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, MoreHorizontal, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { Category, Product } from "@/types";
import { Badge } from "@/components/bo/ui/Badge";
import { Button, ButtonLink } from "@/components/bo/ui/Button";
import { Toggle } from "@/components/bo/ui/Controls";
import { Card, EmptyState, PageHeader, Thumb } from "@/components/bo/ui/Display";
import { Input } from "@/components/bo/ui/Field";
import { Menu } from "@/components/bo/ui/Menu";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { Pills, Tabs, type TabItem } from "@/components/bo/ui/Tabs";
import { useToast } from "@/components/bo/ui/Toast";

const PAGE_SIZE = 25;
type Row = Product & { category?: Category };
type Flag = "is_available" | "is_featured";

export default function ProductsView({ products: initial, categories }: { products: Row[]; categories: Category[] }) {
  const { t, fmt } = useBoI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const toast = useToast();

  const [products, setProducts] = useState(initial);
  useEffect(() => setProducts(initial), [initial]);

  const q = sp.get("q") ?? "";
  const cat = sp.get("categorie") ?? "";
  const dispo = sp.get("dispo") ?? "";
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const [search, setSearch] = useState(q);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const setParams = (changes: Record<string, string | null>, keepPage = false) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!keepPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (search === q) return;
    const id = setTimeout(() => setParams({ q: search.trim() || null }), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const inTab = (p: Row, key: string) => (key === "" ? true : key === "sans" ? !p.category_id : p.category?.slug === key);
  const matches = (p: Row) => {
    if (q && !p.name.toLowerCase().includes(q.trim().toLowerCase())) return false;
    if (dispo === "oui" && !p.is_available) return false;
    if (dispo === "non" && p.is_available) return false;
    return true;
  };

  const filtered = useMemo(() => products.filter((p) => inTab(p, cat) && matches(p)), [products, cat, q, dispo]); // eslint-disable-line react-hooks/exhaustive-deps
  const elsewhere = q && cat ? products.filter((p) => !inTab(p, cat) && matches(p)).length : 0;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const uncategorized = products.filter((p) => !p.category_id).length;

  const tabs: TabItem[] = [
    { key: "", label: t("products.all"), count: products.length, onClick: () => setParams({ categorie: null }) },
    ...categories.map((c) => ({ key: c.slug, label: c.name, count: products.filter((p) => p.category_id === c.id).length, onClick: () => setParams({ categorie: c.slug }) })),
    ...(uncategorized > 0 ? [{ key: "sans", label: t("products.uncategorized"), count: uncategorized, onClick: () => setParams({ categorie: "sans" }) }] : []),
  ];

  const toggle = async (product: Row, flag: Flag, value: boolean, silent = false) => {
    setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, [flag]: value } : p)));
    const { error } = await createClient().from("products").update({ [flag]: value }).eq("id", product.id);
    if (error) {
      setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, [flag]: !value } : p)));
      toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: () => toggle(product, flag, value) });
      return;
    }
    router.refresh();
    if (silent) return;
    const key = flag === "is_available" ? (value ? "nowAvailable" : "nowUnavailable") : value ? "nowFeatured" : "nowNotFeatured";
    toast({ tone: "success", message: t(`products.${key}`, { name: product.name }), actionLabel: t("common.undo"), onAction: () => toggle(product, flag, !value, true) });
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await createClient().from("products").delete().eq("id", toDelete.id);
    setDeleting(false);
    if (error) return setDeleteError(t("common.errorGeneric"));
    setProducts((list) => list.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
    toast({ tone: "success", message: t("products.deleted") });
    router.refresh();
  };

  const subline = (p: Row) => {
    const formats = Array.isArray(p.weight_prices) ? p.weight_prices.length : 0;
    return [p.poids, formats > 0 ? t("products.moreFormats", { count: formats }) : null].filter(Boolean).join(" · ");
  };

  const clearSearch = () => {
    setSearch("");
    setParams({ q: null });
  };

  const empty =
    products.length === 0 ? (
      <EmptyState icon={<Package />} title={t("products.emptyList")} description={t("products.emptyListDesc")} action={<ButtonLink href="/admin/produits/nouveau" variant="primary" icon={<Plus className="h-4 w-4" />}>{t("products.add")}</ButtonLink>} />
    ) : (
      <EmptyState
        icon={<Search />}
        title={t("products.emptySearch")}
        description={q ? t("products.emptySearchDesc", { q }) : undefined}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="secondary" onClick={clearSearch}>
              {t("common.clearSearch")}
            </Button>
            {elsewhere > 0 && (
              <Button variant="ghost" onClick={() => setParams({ categorie: null })}>
                {t("products.searchAll")}
              </Button>
            )}
          </div>
        }
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title={t("products.title")}
          subtitle={
            <>
              <span className="hidden lg:inline">{t("products.countCatalog", { count: products.length })}</span>
              <span className="lg:hidden">{t("products.countShort", { count: products.length })}</span>
            </>
          }
        />
        <ButtonLink href="/admin/produits/nouveau" variant="primary" icon={<Plus className="h-4 w-4" />} className="hidden lg:inline-flex">
          {t("products.add")}
        </ButtonLink>
        <ButtonLink href="/admin/produits/nouveau" variant="primary" iconOnly icon={<Plus className="h-5 w-5" />} aria-label={t("products.add")} className="h-10 w-10 lg:hidden" />
      </div>

      {/* ── Mobile ── */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Input type="search" icon={<Search />} placeholder={t("products.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <Pills items={tabs} active={cat} />
        <Card className="overflow-hidden">
          {filtered.length === 0
            ? empty
            : filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-3 border-b border-bo-line px-3 py-2.5 last:border-0">
                  <button type="button" onClick={() => router.push(`/admin/produits/${p.id}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Thumb src={p.image_url} size={40} />
                    <span className="min-w-0">
                      <span className={cn("block truncate text-bo-body font-medium", p.is_available ? "text-bo-ink" : "text-bo-ink-3")}>{p.name}</span>
                      <span className="block truncate text-bo-small text-bo-ink-3">
                        {fmt.price(p.price)} · {p.category?.name ?? t("products.uncategorized")}
                      </span>
                    </span>
                  </button>
                  <Toggle checked={p.is_available} onChange={(v) => toggle(p, "is_available", v)} label={`${t("products.colAvailable")} — ${p.name}`} />
                </div>
              ))}
        </Card>
      </div>

      {/* ── Desktop ── */}
      <Card className="hidden lg:block">
        <Tabs items={tabs} active={cat} />
        <div className="flex flex-wrap items-center gap-2 border-b border-bo-line px-4 py-3">
          <Input type="search" icon={<Search />} placeholder={t("products.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} boxClassName="w-[320px] lg:h-9" />
          <Menu
            align="left"
            trigger={({ open, toggle: tg, id }) => (
              <Button variant="secondary" aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={tg} className={cn(dispo && "border-bo-focus bg-bo-accent-subtle")}>
                {t("products.availability", { value: t(dispo === "oui" ? "products.availYes" : dispo === "non" ? "products.availNo" : "products.availAll") })}
              </Button>
            )}
            items={[
              { key: "", label: t("products.availAll"), selected: dispo === "", onSelect: () => setParams({ dispo: null }) },
              { key: "oui", label: t("products.availYes"), selected: dispo === "oui", onSelect: () => setParams({ dispo: "oui" }) },
              { key: "non", label: t("products.availNo"), selected: dispo === "non", onSelect: () => setParams({ dispo: "non" }) },
            ]}
          />
          <span className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-bo-md border border-bo-line-strong bg-bo-surface px-3.5 text-bo-body font-medium text-bo-ink shadow-bo-xs">
            <ArrowUpDown className="h-4 w-4 text-bo-icon" aria-hidden />
            {t("products.sort")}
          </span>
        </div>

        {visible.length === 0 ? (
          empty
        ) : (
          <>
            <div className="grid grid-cols-[minmax(0,1fr)_170px_90px_100px_100px_44px] gap-4 border-b border-bo-line bg-bo-subtle px-5 py-2.5 text-bo-caption font-medium text-bo-ink-2">
              <span>{t("products.colProduct")}</span>
              <span>{t("products.colCategory")}</span>
              <span className="text-right">{t("products.colPrice")}</span>
              <span className="text-center">{t("products.colAvailable")}</span>
              <span className="text-center">{t("products.colFeatured")}</span>
              <span />
            </div>
            {visible.map((p) => (
              <div
                key={p.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/admin/produits/${p.id}`)}
                onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && router.push(`/admin/produits/${p.id}`)}
                className="grid min-h-[60px] cursor-pointer grid-cols-[minmax(0,1fr)_170px_90px_100px_100px_44px] items-center gap-4 border-b border-bo-line px-5 py-2.5 transition-colors last:border-0 hover:bg-bo-subtle"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Thumb src={p.image_url} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-bo-body font-medium", p.is_available ? "text-bo-ink" : "text-bo-ink-3")}>{p.name}</span>
                      {p.badge && <Badge tone="accent">{t(`products.badge${p.badge.charAt(0).toUpperCase()}${p.badge.slice(1)}` as never)}</Badge>}
                    </span>
                    {subline(p) && <span className="block truncate text-bo-small text-bo-ink-3">{subline(p)}</span>}
                  </span>
                </span>
                <span className="truncate text-bo-body text-bo-ink-2">
                  {p.category?.name ?? <Badge tone="warning" dot>{t("products.uncategorized")}</Badge>}
                </span>
                <span className="text-right text-bo-body font-medium text-bo-ink tabular-nums">{fmt.price(p.price)}</span>
                <span className="flex justify-center">
                  <Toggle checked={p.is_available} onChange={(v) => toggle(p, "is_available", v)} label={`${t("products.colAvailable")} — ${p.name}`} />
                </span>
                <span className="flex justify-center">
                  <Toggle checked={p.is_featured} onChange={(v) => toggle(p, "is_featured", v)} label={`${t("products.colFeatured")} — ${p.name}`} />
                </span>
                <Menu
                  trigger={({ open, toggle: tg, id }) => (
                    <Button variant="ghost" iconOnly icon={<MoreHorizontal className="h-4 w-4" />} aria-label={t("products.actions", { name: p.name })} aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={tg} />
                  )}
                  items={[
                    { key: "edit", label: t("common.edit"), icon: <Pencil />, href: `/admin/produits/${p.id}` },
                    { key: "shop", label: t("products.viewInShop"), icon: <ExternalLink />, href: `/produits/${p.slug}`, external: true },
                    { key: "delete", label: t("common.delete"), icon: <Trash2 />, danger: true, onSelect: () => setToDelete(p) },
                  ]}
                />
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-bo-small text-bo-ink-3">
                {t("products.pagination", { from: (current - 1) * PAGE_SIZE + 1, to: Math.min(current * PAGE_SIZE, filtered.length), total: filtered.length })}
              </span>
              <span className="flex gap-2">
                <Button variant="secondary" iconOnly icon={<ChevronLeft className="h-4 w-4" />} aria-label={t("products.prevPage")} disabled={current <= 1} onClick={() => setParams({ page: String(current - 1) }, true)} />
                <Button variant="secondary" iconOnly icon={<ChevronRight className="h-4 w-4" />} aria-label={t("products.nextPage")} disabled={current >= pages} onClick={() => setParams({ page: String(current + 1) }, true)} />
              </span>
            </div>
          </>
        )}
      </Card>

      <ConfirmModal
        open={!!toDelete}
        title={t("products.deleteTitle", { name: toDelete?.name ?? "" })}
        description={t("products.deleteDesc")}
        confirmLabel={t("products.deleteConfirm")}
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
