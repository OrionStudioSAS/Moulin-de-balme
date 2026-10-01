"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Calendar, ChevronLeft, LayoutGrid, Menu, Package, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/bo/cn";
import { useBoI18n } from "@/lib/bo/i18n/client";
import type { TKey } from "@/lib/bo/i18n";
import { Avatar } from "@/components/bo/ui/Display";
import { BrandMark } from "./Sidebar";
import { isActive } from "./nav";

const TABS: { href: string; label: TKey; icon: typeof Menu; also?: string[] }[] = [
  { href: "/admin", label: "nav.home", icon: LayoutGrid },
  { href: "/admin/commandes", label: "nav.orders", icon: ShoppingBag },
  { href: "/admin/la-semaine", label: "nav.weekShort", icon: Calendar },
  { href: "/admin/produits", label: "nav.products", icon: Package },
  { href: "/admin/menu", label: "nav.menu", icon: Menu, also: ["/admin/categories", "/admin/recettes", "/admin/clients"] },
];

export function MobileTabBar({ ordersCount }: { ordersCount: number }) {
  const pathname = usePathname();
  const { t } = useBoI18n();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-bo-line bg-bo-surface px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] lg:hidden"
      aria-label={t("brand.admin")}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, also }) => {
          const active = isActive(pathname, href) || (also ?? []).some((p) => isActive(pathname, p));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex flex-col items-center gap-1 py-1 text-bo-caption font-medium", active ? "text-bo-ink" : "text-bo-ink-3")}
              >
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                  {href === "/admin/commandes" && ordersCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-bo-accent px-1 text-[10px] font-semibold leading-none text-bo-ink">
                      {ordersCount}
                    </span>
                  )}
                </span>
                {t(label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Barre supérieure mobile : « Racine » (marque + avatar) ou « Détail » (retour + titre) */
export function MobileTopBar({
  variant = "root",
  title,
  backHref,
  userName,
  action,
}: {
  variant?: "root" | "detail";
  title?: ReactNode;
  backHref?: string;
  userName?: string;
  action?: ReactNode;
}) {
  const { t } = useBoI18n();
  const router = useRouter();

  if (variant === "root") {
    return (
      <div className="-mx-4 -mt-4 mb-4 flex h-[52px] items-center gap-2 px-4 lg:hidden">
        <BrandMark size={28} />
        <span className="flex-1 font-bo-serif text-bo-brand text-bo-ink">{t("brand.name")}</span>
        {userName && (
          <Link href="/admin/menu" aria-label={t("nav.menu")}>
            <Avatar name={userName} />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 -mx-4 -mt-4 mb-4 flex h-[52px] items-center gap-1 bg-bo-app px-2 lg:hidden">
      <button
        type="button"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        aria-label={t("nav.back")}
        className="flex h-10 w-10 items-center justify-center rounded-bo-md text-bo-ink"
      >
        <ChevronLeft className="h-[22px] w-[22px]" />
      </button>
      <span className="flex-1 truncate text-bo-heading font-semibold text-bo-ink">{title}</span>
      {action}
    </div>
  );
}
