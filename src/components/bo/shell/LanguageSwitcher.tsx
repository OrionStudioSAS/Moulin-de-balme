"use client";

import { Segmented } from "@/components/bo/ui/Controls";
import { useBoI18n, useSetBoLocale } from "@/lib/bo/i18n/client";
import type { Locale } from "@/lib/bo/i18n";

export function LanguageSwitcher({ theme = "light", className }: { theme?: "light" | "dark"; className?: string }) {
  const { locale, t } = useBoI18n();
  const setLocale = useSetBoLocale();
  return (
    <Segmented<Locale>
      theme={theme}
      value={locale}
      onChange={setLocale}
      className={className}
      options={[
        { value: "fr", label: t("language.fr") },
        { value: "ja", label: t("language.ja") },
      ]}
    />
  );
}
