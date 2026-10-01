import { BookOpen, Calendar, Folder, LayoutGrid, Package, ShoppingBag, Users, type LucideIcon } from "lucide-react";
import type { TKey } from "@/lib/bo/i18n";

export type NavItem = { href: string; label: TKey; icon: LucideIcon; badge?: "orders" };
export type NavGroup = { label?: TKey; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  { items: [{ href: "/admin", label: "nav.dashboard", icon: LayoutGrid }] },
  {
    label: "nav.groupCatalog",
    items: [
      { href: "/admin/produits", label: "nav.products", icon: Package },
      { href: "/admin/categories", label: "nav.categories", icon: Folder },
      { href: "/admin/la-semaine", label: "nav.week", icon: Calendar },
    ],
  },
  { label: "nav.groupContent", items: [{ href: "/admin/recettes", label: "nav.recipes", icon: BookOpen }] },
  {
    label: "nav.groupSales",
    items: [
      { href: "/admin/commandes", label: "nav.orders", icon: ShoppingBag, badge: "orders" },
      { href: "/admin/clients", label: "nav.customers", icon: Users },
    ],
  },
];

export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}
