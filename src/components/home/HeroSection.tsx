import Link from "next/link";
import Image from "next/image";
import HeroCountdownBar from "./HeroCountdownBar";

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-brown">
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-brown/30 to-brown/20" />
      </div>

      {/* Main content — bottom-left */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[120px] md:pb-[100px]">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-end justify-between gap-8">
          {/* Left: title + description */}
          <div className="max-w-2xl">
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold text-white tracking-wide uppercase leading-[0.9] mb-5">
              Le Moulin de Balme®
            </h1>
            <p className="text-sm md:text-base text-white/90 tracking-[0.15em] uppercase font-medium mb-3">
              Le pain de Brive, réinventé par un voyageur.
            </p>
            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              Pains au levain, farines anciennes, croissants venus d&apos;ailleurs. La boulangerie
              de Stéphane et Tomoko Reinat, ouverte de 7h à 18h au 7 avenue Alsace-Lorraine.
            </p>
          </div>

          {/* Right: all products link */}
          <div className="shrink-0 pb-1">
            <Link
              href="/produits"
              className="text-white/70 hover:text-white text-[11px] tracking-[0.2em] uppercase transition-colors border-b border-white/30 hover:border-white pb-0.5"
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
