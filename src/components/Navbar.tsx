"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LEFT = [
  { label: "Nos produits", href: "/produits" },
  { label: "La Maison Moulin de Balme®", href: "/#histoire" },
  { label: "La Semaine", href: "/#la-semaine" },
  { label: "Stéphane & Yumiko", href: "/#histoire" },
];

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="text-[11px] tracking-widest uppercase text-brown/60 hover:text-brown transition-colors"
    >
      Mon panier ({count})
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brown text-cream text-center py-2 px-4 flex items-center justify-center gap-4 text-[11px] tracking-wider">
        <span className="bg-gold/30 text-gold px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold">
          Nouveau
        </span>
        <span>Commandez avant 17h — Retrait dès le lendemain 7h</span>
        <Link
          href="/click-and-collect"
          className="underline underline-offset-2 hover:text-gold transition-colors whitespace-nowrap"
        >
          En savoir plus &rsaquo;
        </Link>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-brown/10">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex flex-col items-center leading-none mr-4">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="4" fill="#F5F0E8" stroke="#3D2B1F" strokeWidth="0.5" />
              <text x="18" y="23" textAnchor="middle" fontSize="18" fill="#3D2B1F" fontFamily="Georgia,serif">⌂</text>
            </svg>
            <span className="text-[9px] tracking-widest uppercase text-brown font-bold leading-none mt-0.5">
              moulin de balme
            </span>
            <span className="text-[8px] tracking-wider uppercase text-warm-gray leading-none mt-0.5">
              Boulangerie
            </span>
          </Link>

          {/* Nav center */}
          <nav className="hidden lg:flex items-center gap-7 flex-1">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] tracking-widest uppercase text-brown/60 hover:text-brown transition-colors whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-5 ml-auto shrink-0">
            <span className="text-[11px] tracking-wider text-brown/40 border-r border-brown/20 pr-4">
              FR | €
            </span>
            <button className="text-[11px] tracking-widest uppercase text-brown/60 hover:text-brown transition-colors">
              Recherche
            </button>
            <CartButton />
          </div>

          {/* Mobile: cart + burger */}
          <div className="lg:hidden flex items-center gap-3 ml-auto">
            <CartButton />
            <button
              className="p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <div className="w-5 h-px bg-brown mb-1.5" />
              <div className="w-5 h-px bg-brown mb-1.5" />
              <div className="w-5 h-px bg-brown" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-cream border-t border-brown/10 px-6 py-6 flex flex-col gap-4">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase text-brown py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/click-and-collect"
              className="bg-brown text-cream px-5 py-3 text-xs tracking-widest uppercase text-center mt-3"
              onClick={() => setOpen(false)}
            >
              Click &amp; Collect — Commander
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
