"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Nos produits", href: "/produits" },
  { label: "Collections", href: "/collections" },
  { label: "La semaine", href: "/#la-semaine" },
  { label: "Nos farines", href: "/#nos-farines" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-brown/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-widest uppercase text-brown">
            Le Moulin de Balme®
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs tracking-widest uppercase text-brown/70 hover:text-brown transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/click-and-collect" className="btn-primary text-xs">
            Commander
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="w-5 h-px bg-brown mb-1.5" />
          <div className="w-5 h-px bg-brown mb-1.5" />
          <div className="w-5 h-px bg-brown" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-t border-brown/10 px-4 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs tracking-widest uppercase text-brown"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/click-and-collect" className="btn-primary text-center mt-2" onClick={() => setOpen(false)}>
            Commander
          </Link>
        </div>
      )}
    </header>
  );
}
