"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Produits", href: "/admin/produits" },
  { label: "Catégories", href: "/admin/categories" },
  { label: "La Semaine", href: "/admin/la-semaine" },
  { label: "Recettes", href: "/admin/recettes" },
  { label: "Commandes", href: "/admin/commandes" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {NAV.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClick}
            className={`block text-xs tracking-widest uppercase px-3 py-2.5 transition-colors rounded ${
              active
                ? "bg-cream/15 text-cream font-bold"
                : "text-cream/60 hover:text-cream hover:bg-cream/10"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-brown text-cream flex-col min-h-screen">
        <div className="p-6 border-b border-cream/10">
          <p className="text-xs font-bold tracking-widest uppercase text-gold">Le Moulin de Balme</p>
          <p className="text-xs text-cream/50 mt-1">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-cream/10">
          <form action="/api/auth/signout" method="post">
            <button className="text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brown text-cream flex items-center justify-between px-4 h-14 border-b border-cream/10">
        <p className="text-xs font-bold tracking-widest uppercase text-gold">Le Moulin de Balme</p>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="Ouvrir le menu"
        >
          <span className="w-5 h-px bg-cream block" />
          <span className="w-5 h-px bg-cream block" />
          <span className="w-5 h-px bg-cream block" />
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-brown text-cream flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-cream/10">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gold">Le Moulin de Balme</p>
                <p className="text-xs text-cream/50 mt-0.5">Administration</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream text-xl leading-none">
                ✕
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLinks onClick={() => setOpen(false)} />
            </nav>
            <div className="p-4 border-t border-cream/10">
              <form action="/api/auth/signout" method="post">
                <button className="text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors">
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
