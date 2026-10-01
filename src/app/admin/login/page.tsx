import Image from "next/image";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { getBoI18n } from "@/lib/bo/i18n/server";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  const { t } = getBoI18n();
  return (
    <div className="flex min-h-screen bg-bo-app">
      <div className="relative hidden w-[44%] max-w-[640px] shrink-0 overflow-hidden lg:block">
        <Image src="/images/hero-banner.png" alt="" fill priority sizes="640px" className="object-cover object-[35%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-14 bottom-12 text-white">
          <p className="font-bo-serif text-[28px] leading-[34px]">{t("brand.name")}</p>
          <p className="mt-2 text-bo-small text-white/80">{t("brand.tagline")}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
