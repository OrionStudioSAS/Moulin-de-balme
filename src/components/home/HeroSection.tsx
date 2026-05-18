import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] bg-brown overflow-hidden">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-brown/60 z-10" />
      <div className="absolute inset-0 bg-[url('/images/hero-boulangerie.jpg')] bg-cover bg-center" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end px-6 md:px-16 pb-16 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <p className="label-tag text-cream/70 mb-3">
            Boulangerie artisanale — Paris
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-cream tracking-widest uppercase leading-tight mb-4">
            Le Moulin<br />de Balme®
          </h1>
          <p className="text-sm text-cream/80 leading-relaxed mb-2 max-w-sm">
            Pain au levain, tartines macarons, biscuits et saveurs boulangères.
            La boulangerie de Stephane et Yumiko.
          </p>
          <p className="text-xs text-cream/60 mb-8 tracking-wider">
            Passez commande avant 17h pour un retrait le lendemain 7h en boutique.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/click-and-collect" className="btn-primary">
              Click &amp; Collect — Commander
            </Link>
            <Link href="/produits" className="btn-outline border-cream text-cream hover:bg-cream hover:text-brown">
              Voir nos produits
            </Link>
          </div>
        </div>

        {/* Timer / next order */}
        <div className="absolute right-6 md:right-16 bottom-16 bg-brown/80 border border-cream/20 px-6 py-4 text-cream text-center">
          <p className="text-xs tracking-widest uppercase text-cream/60 mb-1">Prochaine commande</p>
          <p className="text-2xl font-bold tracking-widest" id="hero-timer">17:00:00</p>
          <p className="text-xs text-cream/60 mt-1 tracking-wider">Délai de commande</p>
        </div>
      </div>
    </section>
  );
}
