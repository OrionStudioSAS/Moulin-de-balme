export default function InstagramSection() {
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <p className="label-tag mb-1">Suivez-nous</p>
            <h3 className="text-xl font-bold tracking-widest uppercase">
              Instagram @moulindebalme
            </h3>
          </div>
          <a
            href="https://instagram.com/moulindebalme"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Voir le profil
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {placeholders.map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-brown/5 hover:bg-brown/10 transition-colors cursor-pointer"
            />
          ))}
        </div>

        {/* Newsletter */}
        <div id="newsletter" className="mt-16 bg-brown text-cream p-8 md:p-12 text-center max-w-xl mx-auto">
          <p className="label-tag text-cream/60 mb-3">Newsletter</p>
          <h3 className="text-xl font-bold tracking-widest uppercase mb-2">
            Restez informé
          </h3>
          <p className="text-xs text-cream/60 mb-6 tracking-wider">
            Nouveautés, sorties du four, événements spéciaux.
          </p>
          <form className="flex gap-0">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 bg-cream/10 border border-cream/20 px-4 py-3 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="btn-primary bg-gold text-brown hover:bg-gold/90 px-6 py-3 text-xs">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
