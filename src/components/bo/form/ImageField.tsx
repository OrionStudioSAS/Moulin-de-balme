"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { Button } from "@/components/bo/ui/Button";
import { FieldError } from "@/components/bo/ui/Field";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX = 5 * 1024 * 1024;

/** Envoi d'une image dans le stockage « products » ; renvoie l'URL publique */
export function useImageUpload(onUploaded: (url: string) => void) {
  const { t } = useBoI18n();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    if (!TYPES.includes(file.type)) return setError(t("form.imageType"));
    if (file.size > MAX) return setError(t("form.imageTooBig"));
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error: err } = await supabase.storage.from("products").upload(name, file, { upsert: false });
    setUploading(false);
    if (err || !data) return setError(t("common.errorGeneric"));
    onUploaded(supabase.storage.from("products").getPublicUrl(data.path).data.publicUrl);
  };

  return { upload, uploading, error, accept: TYPES.join(",") };
}

/** Dépôt / remplacement d'image. La suppression est immédiate dans le formulaire, effective à l'enregistrement. */
export function ImageField({
  value,
  onChange,
  aspect = "square",
  hint,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: "square" | "landscape" | "portrait";
  hint?: string;
}) {
  const { t } = useBoI18n();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const { upload, uploading, error } = useImageUpload((url) => onChange(url));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const ratio = aspect === "landscape" ? "aspect-[16/10] w-40" : aspect === "portrait" ? "aspect-[3/4] w-24" : "aspect-square w-24";

  return (
    <div>
      {hint && <p className="mb-3 text-bo-small text-bo-ink-3">{hint}</p>}
      <input
        ref={input}
        type="file"
        accept={TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {value ? (
        <div
          className={cn("flex items-center gap-4 rounded-bo-md border border-dashed p-3 transition-colors", over ? "border-bo-focus bg-bo-accent-subtle" : "border-transparent")}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <div className={cn("relative shrink-0 overflow-hidden rounded-bo-md border border-bo-line bg-bo-muted", ratio)}>
            <Image src={value} alt="" fill sizes="200px" className="object-cover" />
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-bo-ink" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-bo-body font-medium text-bo-ink">{t("form.imageCurrent")}</p>
            <p className="mt-0.5 text-bo-small text-bo-ink-3">{t("form.imageReplaceHint")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" icon={<Upload className="h-4 w-4" />} onClick={() => input.current?.click()} disabled={uploading}>
                {t("form.imageReplace")}
              </Button>
              <Button variant="danger" onClick={() => onChange(null)} disabled={uploading}>
                {t("form.imageRemove")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-bo-md border border-dashed px-4 py-8 text-center transition-colors",
            over ? "border-bo-focus bg-bo-accent-subtle" : "border-bo-line-strong bg-bo-subtle hover:border-bo-ink-3"
          )}
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin text-bo-icon" /> : <ImagePlus className="h-6 w-6 text-bo-icon" aria-hidden />}
          <span className="text-bo-body font-medium text-bo-ink">{uploading ? t("form.imageUploading") : t("form.imageDrop")}</span>
          <span className="text-bo-small text-bo-ink-3">{t("form.imageOne")}</span>
        </button>
      )}
      <FieldError>{error}</FieldError>
    </div>
  );
}

/** Tuile image compacte (vignette / bannière de catégorie) */
export function ImageTile({
  label,
  hint,
  value,
  onChange,
  emptyLabel,
  dropHint,
  className,
  frameClassName,
}: {
  label: string;
  hint: string;
  value: string | null;
  onChange: (url: string | null) => void;
  emptyLabel: string;
  dropHint: string;
  className?: string;
  frameClassName: string;
}) {
  const { t } = useBoI18n();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const { upload, uploading, error, accept } = useImageUpload((url) => onChange(url));
  const dnd = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) upload(file);
    },
  };

  return (
    <div className={className}>
      <p className="text-bo-small font-medium text-bo-ink">{label}</p>
      <p className="mb-2 text-bo-caption text-bo-ink-3">{hint}</p>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {value ? (
        <>
          <div {...dnd} className={cn("relative overflow-hidden rounded-bo-md border bg-bo-muted", over ? "border-bo-focus" : "border-bo-line", frameClassName)}>
            <Image src={value} alt="" fill sizes="400px" className="object-cover" />
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-bo-ink" />
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" icon={<Upload className="h-4 w-4" />} onClick={() => input.current?.click()} disabled={uploading}>
              {t("form.imageReplace")}
            </Button>
            <Button variant="secondary" iconOnly icon={<Trash2 className="h-4 w-4" />} aria-label={t("form.imageRemove")} onClick={() => onChange(null)} disabled={uploading} />
          </div>
        </>
      ) : (
        <button
          type="button"
          {...dnd}
          onClick={() => input.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-bo-md border border-dashed px-4 text-center transition-colors",
            over ? "border-bo-focus bg-bo-accent-subtle" : "border-bo-line-strong bg-bo-subtle hover:border-bo-ink-3",
            frameClassName
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin text-bo-icon" /> : <Upload className="h-5 w-5 text-bo-icon" aria-hidden />}
          <span className="text-bo-body font-medium text-bo-ink">{uploading ? t("form.imageUploading") : emptyLabel}</span>
          <span className="text-bo-caption text-bo-ink-3">{dropHint}</span>
        </button>
      )}
      <FieldError>{error}</FieldError>
    </div>
  );
}
