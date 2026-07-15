import Link from "next/link";

const PRESS = [
  {
    outlet: "La Montagne",
    color: "text-red-600",
    quote: "\"De Tokyo à Brive… l'étonnant parcours de Stéphane Reinat, nouvel artisan derrière le Fournil de Balme\"",
  },
  {
    outlet: "Brive",
    color: "text-orange-600",
    quote: "\"Stéphane Reinat et son épouse Yumiko ont repris la boulangerie 7 avenue Alsace-Lorraine. Des pains cuits au levain\"",
  },
  {
    outlet: "La Dépêche",
    color: "text-blue-700",
    quote: "\"Après le Japon et la Chine, ce boulanger s'installe dans le Lot et participe à la meilleure boulangerie de France\"",
  },
];

const FOOTER_COLS = [
  {
    title: "Nos produits",
    links: [
      { label: "Pains", href: "/produits?categorie=pains" },
      { label: "Biscuits", href: "/produits?categorie=biscuits" },
      { label: "Viennoiseries", href: "/produits?categorie=viennoiseries" },
      { label: "Pâtisseries boulangères", href: "/produits?categorie=patisseries" },
      { label: "Farines", href: "/produits?categorie=farines" },
      { label: "Tous les produits", href: "/produits" },
    ],
  },
  {
    title: "Nos adresses",
    links: [
      { label: "Megève", href: "/#contact" },
      { label: "Nous contacter", href: "/#contact" },
    ],
  },
  {
    title: "Le Moulin",
    links: [
      { label: "Notre histoire", href: "/#histoire" },
      { label: "La semaine", href: "/#la-semaine" },
      { label: "Nos farines", href: "/#nos-farines" },
      { label: "FAQ", href: "#" },
      { label: "Contactez-nous", href: "/#contact" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "Politique de confidentialité", href: "#" },
      { label: "Avis des consommateurs", href: "#" },
      { label: "CGU", href: "#" },
      { label: "CGV", href: "#" },
    ],
  },
];

const SHIPPING_ITEMS = [
  "Click & Collect",
  "Livraison France et International",
  "Livraison par Coursier",
  "Paiement Sécurisé",
  "Click & Collect",
  "Livraison France et International",
  "Livraison par Coursier",
  "Paiement Sécurisé",
];

export default function Footer() {
  const igPlaceholders = Array.from({ length: 6 });

  return (
    <footer>
      {/* Social + Newsletter + Instagram */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — dark */}
        <div className="bg-brown text-cream p-10 md:p-14 flex flex-col gap-10">
          <div>
            <p className="text-xs font-bold tracking-widests uppercase text-cream mb-4">
              Suivez-nous
            </p>
            <div className="flex gap-4">
              {["f", "IG", "TK", "in"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 border border-cream/20 flex items-center justify-center text-[11px] text-cream/60 hover:border-gold hover:text-gold transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold tracking-widests uppercase mb-2">
              Newsletter
            </p>
            <p className="text-xs text-cream/50 leading-relaxed mb-5 max-w-xs">
              Pour ne pas en perdre une miette !<br />
              Recevez nos nouvelles recettes exclusives, offres alléchantes et toutes les dernières actualités directement dans votre boîte email !
            </p>
            <form className="flex gap-0">
              <input
                type="email"
                placeholder="E-mail"
                className="flex-1 bg-cream/10 border border-cream/20 px-4 py-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="bg-cream text-brown px-5 text-xs tracking-widests uppercase font-bold hover:bg-gold transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        {/* Right — Instagram */}
        <div className="bg-cream-dark p-10 md:p-14">
          <p className="text-xs font-bold tracking-widests uppercase text-brown mb-6">
            Instagram @moulindebalme
          </p>
          <div className="grid grid-cols-3 gap-2">
            {igPlaceholders.map((_, i) => (
              <a
                key={i}
                href="https://instagram.com/moulindebalme"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-brown/10 hover:bg-brown/15 transition-colors block"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Press */}
      <div className="bg-cream border-t border-b border-brown/10 py-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {PRESS.map((p) => (
            <div key={p.outlet}>
              <p className={`text-sm font-bold italic mb-3 ${p.color}`}>
                {p.outlet}
              </p>
              <p className="text-xs text-warm-gray leading-relaxed italic">
                {p.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping ticker */}
      <div className="bg-brown/5 border-b border-brown/10 py-3 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: "ticker 20s linear infinite" }}
        >
          {[...SHIPPING_ITEMS, ...SHIPPING_ITEMS].map((item, i) => (
            <span key={i} className="text-[11px] tracking-widest uppercase text-brown shrink-0 flex items-center gap-12">
              <span className="text-brown/30 mr-[-32px]">◆</span>
              {item}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Main footer links */}
      <div className="bg-cream py-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex flex-col items-start gap-1">
              <span className="text-xs font-bold tracking-widests uppercase text-brown">
                moulin de balme
              </span>
              <span className="text-[10px] tracking-widests uppercase text-warm-gray">
                Boulangerie · Depuis 2021
              </span>
            </Link>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-bold tracking-widests uppercase text-brown mb-4">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[11px] text-warm-gray hover:text-brown transition-colors tracking-wider"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-cream border-t border-brown/10 py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-2">
          <p className="text-[11px] text-warm-gray tracking-wider">
            © {new Date().getFullYear()} Le Moulin de Balme — Tous droits réservés · Site by Orion Studio
          </p>
          <div className="flex gap-4">
            {["IG", "TK", "in"].map((icon) => (
              <a key={icon} href="#" className="text-[11px] text-warm-gray hover:text-brown transition-colors">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
