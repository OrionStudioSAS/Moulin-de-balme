import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, ChevronRight, ExternalLink, Folder, Globe, LogOut, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBoI18n } from "@/lib/bo/i18n/server";
import { displayName } from "@/lib/bo/user";
import { Avatar, PageHeader } from "@/components/bo/ui/Display";
import { LanguageSwitcher } from "@/components/bo/shell/LanguageSwitcher";

export const metadata: Metadata = { title: "Menu" };

const row = "flex min-h-[52px] items-center gap-3 px-4 text-bo-body font-medium text-bo-ink";

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-bo-small text-bo-ink-3">{label}</p>
      <div className="divide-y divide-bo-line overflow-hidden rounded-bo-lg border border-bo-line bg-bo-surface">{children}</div>
    </section>
  );
}

function NavRow({ href, icon, label, external }: { href: string; icon: ReactNode; label: string; external?: boolean }) {
  const content = (
    <>
      <span className="text-bo-icon [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <span className="flex-1">{label}</span>
      {external ? <ExternalLink className="h-4 w-4 text-bo-icon" aria-hidden /> : <ChevronRight className="h-4 w-4 text-bo-icon" aria-hidden />}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={row}>
      {content}
    </a>
  ) : (
    <Link href={href} className={row}>
      {content}
    </Link>
  );
}

export default async function MenuPage() {
  const { t } = getBoI18n();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = user ? displayName(user) : "";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("nav.menu")} />

      <div className="flex items-center gap-3 rounded-bo-lg border border-bo-line bg-bo-surface p-4">
        <Avatar name={name} size={40} />
        <div className="min-w-0">
          <p className="truncate text-bo-body font-medium text-bo-ink">{name}</p>
          <p className="text-bo-small text-bo-ink-3">{t("nav.role")}</p>
        </div>
      </div>

      <Group label={t("nav.groupSales")}>
        <NavRow href="/admin/clients" icon={<Users />} label={t("nav.customers")} />
      </Group>
      <Group label={t("nav.groupContent")}>
        <NavRow href="/admin/categories" icon={<Folder />} label={t("nav.categories")} />
        <NavRow href="/admin/recettes" icon={<BookOpen />} label={t("nav.recipes")} />
      </Group>
      <Group label={t("nav.shopGroup")}>
        <NavRow href="/" icon={<ExternalLink />} label={t("nav.shop")} external />
      </Group>
      <Group label={t("nav.preferences")}>
        <div className={row}>
          <Globe className="h-5 w-5 text-bo-icon" aria-hidden />
          <span className="flex-1">{t("nav.language")}</span>
          <LanguageSwitcher />
        </div>
      </Group>
      <Group label={t("nav.account")}>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className={`${row} w-full text-bo-ink-danger`}>
            <LogOut className="h-5 w-5" aria-hidden />
            {t("nav.logout")}
          </button>
        </form>
      </Group>
    </div>
  );
}
