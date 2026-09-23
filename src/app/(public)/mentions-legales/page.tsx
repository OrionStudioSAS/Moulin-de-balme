export const metadata = {
  title: "Mentions légales — Le Moulin de Balme",
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[760px] mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-brown mb-12">
          Mentions légales
        </h1>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Éditeur du site</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Le Moulin de Balme<br />
            [Forme juridique] — [Numéro SIRET]<br />
            [Adresse complète]<br />
            [Téléphone]<br />
            [Email de contact]
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Directeur de la publication</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Stéphane Reinat
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Hébergement</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Vercel Inc.<br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" className="underline hover:text-brown">vercel.com</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Conception & développement</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            <a href="https://orion-studio.fr" className="underline hover:text-brown">Orion Studio</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Propriété intellectuelle</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            L'ensemble des contenus présents sur ce site (textes, images, visuels) est la propriété exclusive du Moulin de Balme ou de ses auteurs, et est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Cookies</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Aucune donnée personnelle n'est collectée à des fins publicitaires.
          </p>
        </section>
      </div>
    </div>
  );
}
