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
      className={`text-[11px] tracking-widest uppercase transition-colors ${
        scrolled ? "text-brown/60 hover:text-brown" : "text-white/80 hover:text-white"
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
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const textColor = scrolled
    ? "text-brown/60 hover:text-brown"
    : "text-white/80 hover:text-white";

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brown/90 text-cream text-center py-2 px-4 flex items-center justify-center gap-4 text-[11px] tracking-wider">
        <span className="bg-gold/30 text-gold px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold">
          Nouveau
        </span>
        <span>Commandez avant 17h — Retrait dès le lendemain 7h</span>
        <Link
          href="/click-and-collect"
          className="font-semibold underline underline-offset-2 hover:text-gold transition-colors whitespace-nowrap"
        >
          En savoir plus &rsaquo;
        </Link>
      </div>

      {/* Main header */}
      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-cream/98 backdrop-blur-sm border-b border-brown/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className={`w-16 h-16 relative transition-all duration-300 ${scrolled ? "" : "drop-shadow-sm"}`}>
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
                className={`text-[11px] tracking-widest uppercase transition-colors whitespace-nowrap font-medium ${textColor}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-6 ml-auto shrink-0">
            <span className={`text-[11px] tracking-wider border-r pr-5 transition-colors ${
              scrolled ? "text-brown/40 border-brown/20" : "text-white/40 border-white/20"
            }`}>
              FR | €
            </span>
            <button className={`text-[11px] tracking-widest uppercase transition-colors font-medium ${textColor}`}>
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
              <div className={`w-5 h-px mb-1.5 transition-colors ${scrolled ? "bg-brown" : "bg-white"}`} />
              <div className={`w-5 h-px mb-1.5 transition-colors ${scrolled ? "bg-brown" : "bg-white"}`} />
              <div className={`w-5 h-px transition-colors ${scrolled ? "bg-brown" : "bg-white"}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-cream border-t border-brown/10 px-6 py-6 flex flex-col gap-4">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs tracking-widest uppercase text-brown py-1"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/click-and-collect"
              className="bg-brown text-cream px-5 py-3 text-xs tracking-widest uppercase text-center mt-3"
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
