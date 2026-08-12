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
      { label: "Pain", href: "/produits?categorie=pain" },
      { label: "Viennoiseries", href: "/produits?categorie=viennoiseries" },
      { label: "Pâtisseries", href: "/produits?categorie=patisseries" },
      { label: "Confitures", href: "/produits?categorie=confitures" },
      { label: "Sel", href: "/produits?categorie=sel" },
      { label: "Miel", href: "/produits?categorie=miel" },
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

  return (
    <footer>
      {/* Newsletter */}
      <div className="bg-cream px-6 md:px-12 py-6 md:py-12">
        <div className="bg-brown max-w-[1400px] mx-auto p-10 md:p-14 flex flex-col md:flex-row gap-10 md:gap-20 items-start md:items-center">
          <div className="flex-1">
            <p className="text-2xl font-bold tracking-widests uppercase text-cream mb-2">
              Newsletter
            </p>
            <p className="text-xs text-cream/50 leading-relaxed max-w-sm">
              Pour ne pas en perdre une miette ! Recevez nos nouvelles recettes exclusives, offres alléchantes et toutes les dernières actualités directement dans votre boîte email.
            </p>
          </div>
          <form className="flex gap-0 w-full md:max-w-sm">
            <input
              type="email"
              placeholder="Votre e-mail"
              className="flex-1 bg-cream/10 border border-cream/20 px-4 py-3 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="bg-cream text-brown px-6 text-xs tracking-widests uppercase font-bold hover:bg-gold transition-colors whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
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
