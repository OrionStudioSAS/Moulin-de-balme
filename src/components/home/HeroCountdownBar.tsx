"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function getSecondsUntil17() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(17, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function HeroCountdownBar() {
  const [secs, setSecs] = useState(getSecondsUntil17);

  useEffect(() => {
    const id = setInterval(() => setSecs(getSecondsUntil17()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-brown/90 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center gap-6 md:gap-10">
        {/* Icon + text */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div>
            <p className="text-white text-xs md:text-sm font-bold tracking-widest uppercase leading-tight">
              Click &amp; Collect — Commandez la veille, retirez frais
            </p>
            <p className="text-white text-[11px] tracking-wider mt-0.5 hidden sm:block">
              Passez commande avant 17h pour un retrait dès le lendemain 7h en boutique.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-10 bg-white/30 shrink-0" />

        {/* Countdown */}
        <div className="text-center shrink-0">
          <p className="text-white text-[10px] tracking-widest uppercase mb-0.5">Clôture dans</p>
          <p className="text-white text-2xl font-bold tracking-widest tabular-nums">{fmt(secs)}</p>
        </div>

        {/* CTA */}
        <Link
          href="/click-and-collect"
          className="shrink-0 bg-white text-brown px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-gold transition-colors whitespace-nowrap"
        >
          Je commande
        </Link>
      </div>
    </div>
  );
}
