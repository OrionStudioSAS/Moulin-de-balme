import Link from "next/link";
import Image from "next/image";
import HeroCountdownBar from "./HeroCountdownBar";

export default function HeroSection() {
  return (
    /* mt-[-64px] : remonte derrière le header sticky (64px)
       h-[calc(100vh-36px)] : retire la barre d'annonce (36px) pour tenir dans le viewport */
    <section className="relative h-[calc(100vh-36px)] overflow-hidden bg-brown mt-[-64px]">
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
        {/* Overlay noir 0.3 */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main content — bas gauche */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[90px]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-end justify-between gap-8">
          {/* Left: title + description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-white tracking-wide uppercase leading-none mb-4 whitespace-nowrap">
              Le Moulin de Balme®
            </h1>
            <p className="text-sm text-white tracking-[0.15em] uppercase font-medium mb-3">
              Le pain de Brive, réinventé par un voyageur.
            </p>
            <p className="text-sm text-white leading-relaxed max-w-sm opacity-80">
              Pains au levain, farines anciennes, croissants venus d&apos;ailleurs. La boulangerie
              de Stéphane et Tomoko Reinat, ouverte de 7h à 18h au 7 avenue Alsace-Lorraine.
            </p>
          </div>

          {/* Right: all products link */}
          <div className="shrink-0 pb-1">
            <Link
              href="/produits"
              className="text-white text-[11px] tracking-[0.2em] uppercase transition-colors border-b border-white/50 hover:border-white pb-0.5 whitespace-nowrap"
            >
              Tous les produits
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom C&C bar */}
      <HeroCountdownBar />
    </section>
  );
}
