"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LEFT = [
  { label: "Nos produits", href: "/produits" },
  { label: "La Maison Moulin de Balme®", href: "/#histoire" },
  { label: "La Semaine", href: "/#la-semaine" },
  { label: "Stéphane Reinat", href: "/#histoire" },
];

function CartButton({ scrolled }: { scrolled: boolean }) {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className={`text-[11px] tracking-widest uppercase transition-colors font-bold ${
        scrolled ? "text-black hover:text-black/70" : "text-white hover:text-white/80"
      }`}
    >
      Mon panier ({count})
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Se déclenche quand la barre d'annonce a disparu (~36px)
    const handler = () => setScrolled(window.scrollY > 36);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const textColor = scrolled
    ? "text-black hover:text-black/70"
    : "text-white hover:text-white/80";

  return (
    <>
      {/* Announcement bar — statique, scrolle avec la page */}
      <div className="bg-brown text-white text-center py-2 px-4 flex items-center justify-center gap-4 text-[11px] tracking-wider">
        <span className="bg-white/20 text-white px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold">
          Nouveau
        </span>
        <span className="text-white">Commandez avant 17h — Retrait dès le lendemain 7h</span>
        <Link
          href="/click-and-collect"
          className="font-bold text-white underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          En savoir plus &rsaquo;
        </Link>
      </div>

      {/* Header — sticky : transparent en position naturelle, blanc quand collé en haut */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-sm border-b border-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="w-16 h-16 relative">
              <Image
                src="/images/logo.png"
                alt="Moulin de Balme"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Nav center */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-[11px] tracking-widest uppercase transition-colors whitespace-nowrap font-bold ${textColor}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-6 ml-auto shrink-0">
            <span className={`text-[11px] tracking-wider border-r pr-5 transition-colors font-bold ${
              scrolled ? "text-black/40 border-black/20" : "text-white/40 border-white/30"
            }`}>
              FR | €
            </span>
            <button className={`text-[11px] tracking-widest uppercase transition-colors font-bold ${textColor}`}>
              Recherche
            </button>
            <CartButton scrolled={scrolled} />
          </div>

          {/* Mobile: cart + burger */}
          <div className="lg:hidden flex items-center gap-3 ml-auto">
            <CartButton scrolled={scrolled} />
            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <div className={`w-5 h-px mb-1.5 transition-colors ${scrolled ? "bg-black" : "bg-white"}`} />
              <div className={`w-5 h-px mb-1.5 transition-colors ${scrolled ? "bg-black" : "bg-white"}`} />
              <div className={`w-5 h-px transition-colors ${scrolled ? "bg-black" : "bg-white"}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-black/10 px-6 py-6 flex flex-col gap-4">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase text-black font-bold py-1"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/click-and-collect"
              className="bg-brown text-white px-5 py-3 text-xs tracking-widest uppercase text-center mt-3 font-bold"
              onClick={() => setMobileOpen(false)}
            >
              Click &amp; Collect — Commander
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
