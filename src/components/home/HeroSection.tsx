"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCountdownBar from "./HeroCountdownBar";
import { FadeInOnLoad } from "@/components/animations/FadeIn";

export default function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-37px)] overflow-hidden bg-brown mt-[-64px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="Stéphane Reinat — Le Moulin de Balme"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[160px] md:pb-[100px]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-end justify-between gap-8">
          <FadeInOnLoad className="flex-1 min-w-0" delay={0.15}>
            <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-white tracking-wide uppercase leading-tight mb-4">
              Le Moulin<br className="md:hidden" /> de Balme®
            </h1>
            <p className="text-sm text-white tracking-[0.15em] uppercase font-medium mb-3">
              Le pain de Brive, réinventé par un voyageur.
            </p>
            <p className="text-sm text-white leading-relaxed max-w-sm">
              Pains au levain, farines anciennes, croissants venus d&apos;ailleurs. La boulangerie
              de Stéphane et Tomoko Reinat, ouverte de 7h à 18h au 7 avenue Alsace-Lorraine.
            </p>
          </FadeInOnLoad>

          <FadeInOnLoad className="hidden md:block shrink-0 pb-1" delay={0.35}>
            <Link
              href="/produits"
              className="text-white text-[11px] tracking-[0.2em] uppercase transition-colors border-b border-white/50 hover:border-white pb-0.5 whitespace-nowrap"
            >
              Tous les produits
            </Link>
          </FadeInOnLoad>
        </div>
      </div>

      <HeroCountdownBar />
    </section>
  );
}
