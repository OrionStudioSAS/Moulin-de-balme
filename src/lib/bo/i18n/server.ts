import { cookies } from "next/headers";
import { createFormatters, createT, isLocale, LOCALE_COOKIE, type Locale } from "./index";

export function getBoLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "fr";
}

export function getBoI18n() {
  const locale = getBoLocale();
  return { locale, t: createT(locale), fmt: createFormatters(locale) };
}
