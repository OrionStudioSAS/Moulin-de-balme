import type { Metadata } from "next";
import { Inter, Instrument_Serif, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { BoI18nProvider } from "@/lib/bo/i18n/client";
import { getBoLocale } from "@/lib/bo/i18n/server";
import "./admin.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-bo-sans", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-bo-serif", display: "swap" });
// Polices japonaises : déclarées ici mais leur variable n'est appliquée qu'en japonais, donc rien n'est téléchargé en français
const notoSans = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-bo-sans-jp", preload: false, display: "swap" });
const notoSerif = Noto_Serif_JP({ subsets: ["latin"], weight: "400", variable: "--font-bo-serif-jp", preload: false, display: "swap" });

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = getBoLocale();
  const fonts = [inter.variable, instrument.variable, locale === "ja" ? `${notoSans.variable} ${notoSerif.variable}` : ""].join(" ");

  return (
    <div id="bo-root" lang={locale} className={`bo min-h-screen ${fonts}`}>
      <BoI18nProvider locale={locale}>{children}</BoI18nProvider>
    </div>
  );
}
