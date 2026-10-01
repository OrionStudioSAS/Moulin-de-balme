"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, ChevronDown, Clock, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { CHIP_COLORS, DIFFICULTIES, RECIPE_CATEGORIES } from "@/lib/bo/recipes";
import type { Recipe, RecipeStep } from "@/types";
import { Badge, Chip, chipClass, type ChipColor } from "@/components/bo/ui/Badge";
import { Button, ButtonLink } from "@/components/bo/ui/Button";
import { Toggle } from "@/components/bo/ui/Controls";
import { FieldError, FieldHelp, Input, Label, Select, Textarea } from "@/components/bo/ui/Field";
import { ConfirmModal } from "@/components/bo/ui/Modal";
import { useToast } from "@/components/bo/ui/Toast";
import { MobileTopBar } from "@/components/bo/shell/MobileNav";
import { ImageField } from "@/components/bo/form/ImageField";
import { SaveBar } from "@/components/bo/form/SaveBar";
import { Section, ToggleRow } from "@/components/bo/form/Section";
import { SortableItem, SortableList } from "@/components/bo/form/Sortable";
import { useUnsavedGuard } from "@/components/bo/form/useUnsavedGuard";
import { slugify } from "@/components/bo/products/ProductEditor";

type Line = { id: string; value: string };
type Step = RecipeStep & { id: string };

let uid = 0;
const nextId = () => `k${Date.now().toString(36)}${(uid++).toString(36)}`;

function toForm(r?: Recipe) {
  return {
    title: r?.title ?? "",
    slug: r?.slug ?? "",
    subtitle: r?.subtitle ?? "",
    description: r?.description ?? "",
    image_url: r?.image_url ?? null,
    category: r?.category ?? "pains",
    difficulty: r?.difficulty ?? "Intermédiaire",
    total_time: r?.total_time ?? "",
    portions: r?.portions ?? "",
    badge: r?.badge ?? "",
    is_published: r?.is_published ?? false,
    sort_order: String(r?.sort_order ?? 0),
    tags: r?.tags ?? [],
    ingredients: (r?.ingredients?.length ? r.ingredients : [""]).map((value, i) => ({ id: `i${i}`, value })) as Line[],
    materiel: (r?.materiel?.length ? r.materiel : [""]).map((value, i) => ({ id: `m${i}`, value })) as Line[],
    steps: (r?.steps?.length ? r.steps : [{ title: "", chip: "", chip_color: "green", description: "" }]).map((s, i) => ({ ...s, id: `s${i}` })) as Step[],
  };
}
type FormState = ReturnType<typeof toForm>;

export default function RecipeEditor({ recipe }: { recipe?: Recipe }) {
  const { t } = useBoI18n();
  const router = useRouter();
  const toast = useToast();
  const isNew = !recipe;

  const [initial, setInitial] = useState(() => toForm(recipe));
  const [form, setForm] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [openStep, setOpenStep] = useState<string | null>(initial.steps.length === 1 ? initial.steps[0].id : null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const lineRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  const { modal: leaveModal } = useUnsavedGuard(dirty && !saving, t("form.leaveDescRecipe"));
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const filledSteps = form.steps.filter((s) => s.title.trim() || s.chip.trim() || s.description.trim());
  const errors = {
    title: !form.title.trim() ? t("recipes.titleRequired") : null,
    steps: filledSteps.some((s) => !s.title.trim()) ? t("recipes.stepTitleRequired") : null,
  };
  const errorCount = Object.values(errors).filter(Boolean).length;

  const save = async () => {
    setSubmitted(true);
    setServerError(null);
    if (errors.title) return titleRef.current?.focus();
    if (errors.steps) {
      const bad = filledSteps.find((s) => !s.title.trim());
      if (bad) setOpenStep(bad.id);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const slug = slugify(form.slug || form.title);
    const { data: clash } = await supabase.from("recipes").select("id").eq("slug", slug).neq("id", recipe?.id ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
    if (clash) {
      setSaving(false);
      return setServerError(t("recipes.slugTaken"));
    }

    const payload = {
      title: form.title.trim(),
      slug,
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url,
      category: form.category,
      difficulty: form.difficulty,
      total_time: form.total_time.trim() || null,
      portions: form.portions.trim() || null,
      badge: form.badge.trim() || null,
      is_published: form.is_published,
      published_at: form.is_published ? recipe?.published_at ?? new Date().toISOString() : null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      tags: form.tags,
      ingredients: form.ingredients.map((l) => l.value.trim()).filter(Boolean),
      materiel: form.materiel.map((l) => l.value.trim()).filter(Boolean),
      steps: filledSteps.map(({ title, chip, chip_color, description }) => ({ title: title.trim(), chip: chip.trim(), chip_color, description: description.trim() })),
    };

    if (isNew) {
      const { data, error } = await supabase.from("recipes").insert(payload).select("id").single();
      setSaving(false);
      if (error || !data) return toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: save });
      setInitial(form);
      toast({ tone: "success", message: t("recipes.created") });
      router.replace(`/admin/recettes/${data.id}/edit`);
      router.refresh();
      return;
    }

    const { error } = await supabase.from("recipes").update(payload).eq("id", recipe.id);
    setSaving(false);
    if (error) return toast({ tone: "error", message: t("common.errorGeneric"), actionLabel: t("common.retry"), onAction: save });
    const saved = { ...form, slug };
    setForm(saved);
    setInitial(saved);
    setSubmitted(false);
    toast({ tone: "success", message: t("common.saved") });
    router.refresh();
  };

  const remove = async () => {
    if (!recipe) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await createClient().from("recipes").delete().eq("id", recipe.id);
    setDeleting(false);
    if (error) return setDeleteError(t("common.errorGeneric"));
    setInitial(form);
    toast({ tone: "success", message: t("recipes.deleted") });
    router.push("/admin/recettes");
    router.refresh();
  };

  const addLine = (key: "ingredients" | "materiel") => {
    const line = { id: nextId(), value: "" };
    setForm((f) => ({ ...f, [key]: [...f[key], line] }));
    setTimeout(() => lineRefs.current[line.id]?.focus(), 0);
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/,$/, "");
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const addStep = () => {
    const step = { id: nextId(), title: "", chip: "", chip_color: "green", description: "" };
    setForm((f) => ({ ...f, steps: [...f.steps, step] }));
    setOpenStep(step.id);
  };

  const optional = <span className="font-normal text-bo-ink-3"> · {t("form.optional")}</span>;
  const title = isNew ? t("recipes.newTitle") : initial.title;

  const lines = (key: "ingredients" | "materiel", label: string, addLabel: string, placeholder: string) => (
    <Section
      title={
        <span className="flex items-center gap-2">
          {label}
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-bo-neutral-bg px-1.5 text-bo-caption text-bo-neutral">{form[key].filter((l) => l.value.trim()).length}</span>
        </span>
      }
    >
      <SortableList items={form[key]} onChange={(items) => set(key, items)}>
        <div className="flex flex-col gap-2">
          {form[key].map((line, i) => (
            <SortableItem key={line.id} id={line.id} handleLabel={t("recipes.dragLine")}>
              <div className="flex items-center gap-1.5">
                <Input
                  ref={(el) => {
                    lineRefs.current[line.id] = el;
                  }}
                  aria-label={`${label} ${i + 1}`}
                  value={line.value}
                  placeholder={placeholder}
                  boxClassName="flex-1"
                  onChange={(e) => set(key, form[key].map((l) => (l.id === line.id ? { ...l, value: e.target.value } : l)))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (i === form[key].length - 1) addLine(key);
                      else lineRefs.current[form[key][i + 1].id]?.focus();
                    }
                  }}
                />
                <Button variant="ghost" iconOnly icon={<Trash2 className="h-4 w-4" />} aria-label={t("recipes.removeLine")} onClick={() => set(key, form[key].filter((l) => l.id !== line.id))} />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableList>
      <Button variant="ghost" icon={<Plus className="h-4 w-4" />} onClick={() => addLine(key)} className="self-start">
        {addLabel}
      </Button>
    </Section>
  );

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <SaveBar
        visible={dirty}
        saving={saving}
        actionLabel={isNew ? t("recipes.create") : undefined}
        onSave={save}
        onCancel={() => {
          setForm(initial);
          setSubmitted(false);
          setServerError(null);
        }}
      />
      <MobileTopBar variant="detail" title={t("recipes.title")} backHref="/admin/recettes" />
      <div className="hidden lg:block">
        <Link href="/admin/recettes" className="inline-flex items-center gap-1.5 text-bo-small text-bo-ink-2 hover:text-bo-ink">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("recipes.title")}
        </Link>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-bo-serif text-bo-display-s font-normal text-bo-ink lg:text-bo-display">{title}</h1>
          {!isNew && (
            <Badge tone={initial.is_published ? "success" : "neutral"} dot>
              {t(initial.is_published ? "recipes.statusPublished" : "recipes.statusDraft")}
            </Badge>
          )}
        </div>
        {!isNew && (
          <div className="flex gap-2">
            {initial.is_published && (
              <ButtonLink href={`/recettes/${initial.slug}`} target="_blank" variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
                {t("recipes.viewRecipe")}
              </ButtonLink>
            )}
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
              {t("common.delete")}
            </Button>
          </div>
        )}
      </div>

      {((submitted && errorCount > 0) || serverError) && (
        <div role="alert" className="flex items-center gap-2 rounded-bo-md border border-bo-line-danger/30 bg-bo-danger-bg px-4 py-3 text-bo-body text-bo-ink-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {serverError ?? t("form.errorsSummary", { count: errorCount })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-5">
          <Section title={t("recipes.secInfo")}>
            <div>
              <Label htmlFor="title">
                {t("recipes.titleLabel")} <span className="text-bo-ink-danger">*</span>
              </Label>
              <Input
                ref={titleRef}
                id="title"
                value={form.title}
                invalid={submitted && !!errors.title}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
                }}
              />
              <FieldError>{submitted && errors.title}</FieldError>
            </div>
            <div>
              <Label htmlFor="subtitle">
                <span>
                  {t("recipes.subtitle")}
                  {optional}
                </span>
              </Label>
              <Input id="subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              <FieldHelp>{t("recipes.subtitleHint")}</FieldHelp>
            </div>
            <div>
              <Label htmlFor="intro">
                <span>
                  {t("recipes.intro")}
                  {optional}
                </span>
              </Label>
              <Textarea id="intro" value={form.description} onChange={(e) => set("description", e.target.value)} />
              <FieldHelp>{t("recipes.introHint")}</FieldHelp>
            </div>
          </Section>

          <Section title={t("form.image")}>
            <ImageField value={form.image_url} onChange={(url) => set("image_url", url)} aspect="landscape" hint={t("recipes.imageHint")} />
          </Section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {lines("ingredients", t("recipes.ingredients"), t("recipes.addIngredient"), t("recipes.ingredientPlaceholder"))}
            {lines("materiel", t("recipes.materiel"), t("recipes.addMateriel"), t("recipes.materielPlaceholder"))}
          </div>

          <Section
            title={
              <span className="flex items-center gap-2">
                {t("recipes.steps")}
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-bo-neutral-bg px-1.5 text-bo-caption text-bo-neutral">{form.steps.length}</span>
              </span>
            }
            hint={t("recipes.stepsHint")}
            action={
              <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={addStep}>
                <span className="hidden sm:inline">{t("recipes.addStep")}</span>
              </Button>
            }
          >
            {submitted && errors.steps && <FieldError>{errors.steps}</FieldError>}
            <SortableList items={form.steps} onChange={(steps) => set("steps", steps)}>
              <div className="flex flex-col gap-2">
                {form.steps.map((step, i) => {
                  const isOpen = openStep === step.id;
                  const update = (patch: Partial<RecipeStep>) => set("steps", form.steps.map((s) => (s.id === step.id ? { ...s, ...patch } : s)));
                  const missingTitle = submitted && !step.title.trim() && (step.chip.trim() || step.description.trim());
                  return (
                    <SortableItem key={step.id} id={step.id} handleLabel={t("recipes.dragStep", { n: i + 1 })} className="items-start">
                      <div className={cn("overflow-hidden rounded-bo-lg border", isOpen ? "border-bo-line-strong" : "border-bo-line", missingTitle && "border-bo-line-danger")}>
                        <button
                          type="button"
                          onClick={() => setOpenStep(isOpen ? null : step.id)}
                          aria-expanded={isOpen}
                          className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left", isOpen ? "bg-bo-subtle" : "hover:bg-bo-subtle")}
                        >
                          <span className={cn("inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-full text-bo-caption font-semibold tabular-nums", isOpen ? "bg-bo-primary text-bo-ink-inverse" : "bg-bo-muted text-bo-ink-2")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={cn("block truncate text-bo-body font-semibold", step.title ? "text-bo-ink" : "text-bo-ink-3")}>{step.title || t("recipes.stepUntitled")}</span>
                            {!isOpen && step.description && <span className="block truncate text-bo-small text-bo-ink-3">{step.description}</span>}
                          </span>
                          {step.chip && <Chip color={(step.chip_color as ChipColor) || "green"}>{step.chip}</Chip>}
                          <ChevronDown className={cn("h-4 w-4 shrink-0 text-bo-icon transition-transform", isOpen && "rotate-180")} aria-hidden />
                        </button>
                        {isOpen && (
                          <div className="flex flex-col gap-4 border-t border-bo-line px-3 py-4 sm:px-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`st-${step.id}`}>
                                  {t("recipes.stepTitle")} <span className="text-bo-ink-danger">*</span>
                                </Label>
                                <Input id={`st-${step.id}`} value={step.title} invalid={!!missingTitle} onChange={(e) => update({ title: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor={`sc-${step.id}`}>{t("recipes.stepChip")}</Label>
                                <Input id={`sc-${step.id}`} value={step.chip} onChange={(e) => update({ chip: e.target.value })} />
                                <FieldHelp>{t("recipes.stepChipHint")}</FieldHelp>
                              </div>
                            </div>
                            <div>
                              <p className="mb-1.5 text-bo-small font-medium text-bo-ink">{t("recipes.stepColor")}</p>
                              <div role="radiogroup" aria-label={t("recipes.stepColor")} className="flex flex-wrap gap-1.5">
                                {CHIP_COLORS.map((c) => {
                                  const selected = step.chip_color === c.value;
                                  return (
                                    <button
                                      key={c.value}
                                      type="button"
                                      role="radio"
                                      aria-checked={selected}
                                      onClick={() => update({ chip_color: c.value })}
                                      className={cn(
                                        "inline-flex h-[30px] items-center gap-1.5 rounded-full pl-2 pr-3 text-bo-caption font-medium",
                                        selected ? cn(chipClass[c.value], "border-[1.5px] border-current") : "border border-bo-line-strong bg-bo-surface text-bo-ink-2"
                                      )}
                                    >
                                      <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border-[1.5px]", selected ? "border-current" : "border-bo-line-strong")}>
                                        {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                      </span>
                                      {t(c.label)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`sd-${step.id}`}>{t("recipes.stepDescription")}</Label>
                              <Textarea id={`sd-${step.id}`} value={step.description} onChange={(e) => update({ description: e.target.value })} />
                            </div>
                            <Button
                              variant="danger"
                              icon={<Trash2 className="h-4 w-4" />}
                              className="self-start"
                              onClick={() => {
                                set("steps", form.steps.filter((s) => s.id !== step.id));
                                setOpenStep(null);
                              }}
                            >
                              {t("recipes.deleteStep")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableList>
          </Section>

          <Section title={t("form.seo")} hint={t("recipes.seoHint")}>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
              />
              <FieldHelp>{t("recipes.slugHelp")}</FieldHelp>
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-20">
          <Section title={t("recipes.secPublication")}>
            <ToggleRow label={t("recipes.publishedToggle")} hint={t("recipes.publishedHint")} control={<Toggle checked={form.is_published} onChange={(v) => set("is_published", v)} label={t("recipes.publishedToggle")} />} />
            <div>
              <Label htmlFor="sort">{t("form.sortOrder")}</Label>
              <Input id="sort" type="number" inputMode="numeric" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
              <FieldHelp>{t("recipes.sortHint")}</FieldHelp>
            </div>
          </Section>

          <Section title={t("recipes.secOrganisation")}>
            <div>
              <Label htmlFor="category">{t("recipes.category")}</Label>
              <Select id="category" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {RECIPE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {t(c.label)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">{t("recipes.difficulty")}</Label>
              <Select id="difficulty" value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {t(d.label)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="time">{t("recipes.totalTime")}</Label>
              <Input id="time" icon={<Clock />} value={form.total_time} placeholder={t("recipes.totalTimePlaceholder")} onChange={(e) => set("total_time", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="portions">{t("recipes.portions")}</Label>
              <Input id="portions" value={form.portions} placeholder={t("recipes.portionsPlaceholder")} onChange={(e) => set("portions", e.target.value)} />
            </div>
          </Section>

          <Section title={t("recipes.tags")}>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex h-7 items-center gap-1 rounded-full border border-bo-line-strong bg-bo-surface pl-2.5 pr-1 text-bo-small font-medium text-bo-ink">
                    {tag}
                    <button type="button" onClick={() => set("tags", form.tags.filter((x) => x !== tag))} aria-label={t("recipes.removeTag", { name: tag })} className="rounded-full p-0.5 text-bo-icon hover:bg-bo-muted hover:text-bo-ink">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Input
              icon={<Plus />}
              value={tagInput}
              placeholder={t("recipes.tagPlaceholder")}
              aria-label={t("recipes.tags")}
              onChange={(e) => (e.target.value.endsWith(",") ? (setTagInput(e.target.value), setTimeout(addTag, 0)) : setTagInput(e.target.value))}
              onBlur={addTag}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </Section>

          <Section title={t("recipes.badge")}>
            <div>
              <Label htmlFor="badge">
                <span>
                  {t("recipes.badgeText")}
                  {optional}
                </span>
              </Label>
              <Input id="badge" value={form.badge} onChange={(e) => set("badge", e.target.value)} />
              <FieldHelp>{t("recipes.badgeHint")}</FieldHelp>
            </div>
          </Section>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title={t("recipes.deleteTitle", { name: initial.title })}
        description={t("recipes.deleteDesc")}
        confirmLabel={t("recipes.deleteConfirm")}
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
