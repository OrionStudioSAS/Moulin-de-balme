import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[clamp(6rem,20vw,14rem)] font-bold leading-none text-brown/10 select-none tracking-tighter">
        404
      </p>

      <div className="-mt-4 md:-mt-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-brown/40 mb-4">
          Page introuvable
        </p>
        <h1 className="text-[clamp(1.6rem,4vw,3rem)] font-bold uppercase tracking-tight text-brown leading-tight mb-4">
          Cette page<br />n&apos;existe pas.
        </h1>
        <p className="text-sm text-warm-gray leading-relaxed max-w-sm mx-auto mb-10">
          La page que vous cherchez a peut-être été déplacée ou supprimée.
          Retournez à l&apos;accueil pour continuer votre visite.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center bg-brown text-cream text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-brown/90 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/produits"
            className="inline-flex items-center border border-brown text-brown text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-brown hover:text-cream transition-colors"
          >
            Voir nos produits
          </Link>
        </div>
      </div>

      <p className="mt-16 text-[10px] tracking-widest uppercase text-brown/30">
        Le Moulin de Balme® — Boulangerie artisanale à Brive-la-Gaillarde
      </p>
    </div>
  );
}
