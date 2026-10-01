"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createFormatters, createT, LOCALE_COOKIE, type Formatters, type Locale, type TFn } from "./index";

type Ctx = { locale: Locale; t: TFn; fmt: Formatters };

const I18nContext = createContext<Ctx | null>(null);

export function BoI18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: createT(locale), fmt: createFormatters(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useBoI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useBoI18n doit être utilisé sous BoI18nProvider");
  return ctx;
}

export function useSetBoLocale() {
  const router = useRouter();
  return (locale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/admin; max-age=31536000; samesite=lax`;
    router.refresh();
  };
}
