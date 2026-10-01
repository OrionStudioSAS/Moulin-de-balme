"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Globe, LogOut } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { Avatar } from "@/components/bo/ui/Display";
import { Count } from "@/components/bo/ui/Badge";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_GROUPS, isActive } from "./nav";

export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-bo-md bg-bo-accent font-bo-serif text-bo-ink"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
      aria-hidden
    >
      M
    </span>
  );
}

const itemCls = "flex h-9 items-center gap-2.5 rounded-bo-md px-2.5 text-bo-body font-medium transition-colors";

export function Sidebar({ userName, ordersCount }: { userName: string; ordersCount: number }) {
  const pathname = usePathname();
  const { t } = useBoI18n();

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col overflow-y-auto bg-bo-sidebar px-3 pb-4 pt-5 lg:flex">
      <Link href="/admin" className="flex items-center gap-3 px-2 pb-5">
        <BrandMark />
        <span className="min-w-0">
          <span className="block font-bo-serif text-bo-brand text-bo-ink-sidebar">{t("brand.name")}</span>
          <span className="block text-bo-caption text-bo-ink-sidebar-muted">{t("brand.admin")}</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5" aria-label={t("brand.admin")}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.label && <p className="px-2.5 pb-1.5 pt-4 text-bo-caption text-bo-ink-sidebar-muted">{t(group.label)}</p>}
            {group.items.map(({ href, label, icon: Icon, badge }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemCls,
                    active ? "bg-bo-sidebar-active text-bo-ink-sidebar" : "text-bo-ink-sidebar-muted hover:bg-bo-sidebar-active/60 hover:text-bo-ink-sidebar"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                  <span className="flex-1 truncate">{t(label)}</span>
                  {badge === "orders" && ordersCount > 0 && <Count value={ordersCount} accent />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 pt-6">
        <a href="/" target="_blank" rel="noopener" className={cn(itemCls, "text-bo-ink-sidebar-muted hover:bg-bo-sidebar-active/60 hover:text-bo-ink-sidebar")}>
          <ExternalLink className="h-[18px] w-[18px] shrink-0" aria-hidden />
          <span className="flex-1">{t("nav.shop")}</span>
        </a>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <Globe className="h-[18px] w-[18px] shrink-0 text-bo-ink-sidebar-muted" aria-label={t("nav.language")} />
          <LanguageSwitcher theme="dark" className="flex-1" />
        </div>
        <div className="my-1 h-px bg-bo-line-sidebar" />
        <div className="flex items-center gap-2.5 px-2 pt-3">
          <Avatar name={userName} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-bo-body font-medium text-bo-ink-sidebar">{userName}</span>
            <span className="block text-bo-caption text-bo-ink-sidebar-muted">{t("nav.role")}</span>
          </span>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              aria-label={t("nav.logout")}
              title={t("nav.logout")}
              className="rounded-bo-sm p-1 text-bo-ink-sidebar-muted transition-colors hover:text-bo-ink-sidebar"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
