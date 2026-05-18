import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Le Moulin de Balme",
    links: [
      { label: "Notre histoire", href: "/#histoire" },
      { label: "Nos produits", href: "/produits" },
      { label: "Collections", href: "/collections" },
      { label: "La semaine", href: "/#la-semaine" },
      { label: "Nos farines", href: "/#nos-farines" },
    ],
  },
  {
    title: "Commander",
    links: [
      { label: "Click & Collect", href: "/click-and-collect" },
      { label: "Livraison France", href: "/livraison" },
      { label: "Livraison International", href: "/livraison-internationale" },
      { label: "Livraison par Courrier", href: "/courrier" },
    ],
  },
  {
    title: "Infos",
    links: [
      { label: "Nous contacter", href: "/#contact" },
      { label: "Suivez-nous", href: "#" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brown text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4">
              Le Moulin de Balme®
            </p>
            <p className="text-xs text-cream/60 leading-relaxed">
              Boulangerie artisanale. Chaque pièce est façonnée à la main avec
              du sel, du levain et du temps.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="text-xs text-cream/60 hover:text-cream transition-colors uppercase tracking-wider">FB</a>
              <a href="#" className="text-xs text-cream/60 hover:text-cream transition-colors uppercase tracking-wider">IG</a>
              <a href="#" className="text-xs text-cream/60 hover:text-cream transition-colors uppercase tracking-wider">IN</a>
            </div>
          </div>

          {/* Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4 text-gold">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-cream/60 hover:text-cream transition-colors tracking-wider"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-cream/40 tracking-wider">
            © {new Date().getFullYear()} Le Moulin de Balme. Tous droits réservés.
          </p>
          <p className="text-xs text-cream/40 tracking-wider">
            Paiement sécurisé — Commande en ligne
          </p>
        </div>
      </div>
    </footer>
  );
}
