import Image from "next/image";
import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Nos produits",
    links: [
      { label: "Pains", href: "/produits?categorie=pain" },
      { label: "Biscuits", href: "/produits?categorie=biscuits" },
      { label: "Viennoiseries", href: "/produits?categorie=viennoiseries" },
      { label: "Pâtisseries boulangères", href: "/produits?categorie=patisseries" },
      { label: "Épicerie", href: "/produits?categorie=epicerie" },
      { label: "Livres et accessoires", href: "/produits?categorie=accessoires" },
      { label: "Coffrets et paniers", href: "/produits?categorie=coffrets" },
      { label: "Tous les produits", href: "/produits" },
    ],
  },
  {
    title: "Nos adresses",
    links: [
      { label: "Megève", href: "/#contact" },
      { label: "Brive-la-Gaillarde", href: "/#contact" },
      { label: "Saint-Julien", href: "/#contact" },
      { label: "Aurillac", href: "/#contact" },
      { label: "Nous contacter", href: "/#contact" },
      { label: "Toutes les boutiques", href: "/#contact" },
    ],
  },
  {
    title: "Le Moulin®",
    links: [
      { label: "Notre histoire", href: "/la-maison" },
      { label: "Savoir-faire", href: "/stephane-reinat" },
      { label: "La semaine", href: "/la-semaine" },
      { label: "Nos farines", href: "/#nos-farines" },
      { label: "FAQ", href: "#" },
      { label: "Contactez-nous", href: "/#contact" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Mentions légales", href: "#" },
      { label: "Politique de Confidentialité", href: "#" },
      { label: "Avis des consommateurs", href: "#" },
      { label: "CGU", href: "#" },
      { label: "CGV", href: "#" },
      { label: "Modifier mes préférences en matière de cookie", href: "#" },
    ],
  },
];

function InstagramIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 8.9H3.78V20h3.16V8.9ZM5.36 4a1.84 1.84 0 1 0 0 3.68A1.84 1.84 0 0 0 5.36 4Zm15.02 9.67c0-3.34-1.78-4.9-4.16-4.9a3.59 3.59 0 0 0-3.23 1.78V8.9H9.96V20h3.16v-5.5c0-1.45.27-2.85 2.07-2.85 1.77 0 1.79 1.66 1.79 2.94V20h3.16l.24-6.33Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-cream text-brown">
      <div className="px-6 md:px-12 pt-14 pb-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-[1fr_0.9fr_0.9fr_1fr_1.15fr] md:gap-16">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brown">
                {col.title}
              </p>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm leading-tight text-brown/90 hover:text-brown hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-brown">
              Suivez toute l&apos;actualité Moulin de Balme
            </p>
            <form className="mb-5 flex items-center border-b border-brown/60 pb-2">
              <input
                type="email"
                aria-label="Votre adresse e-mail"
                placeholder="VOTRE ADRESSE E-MAIL"
                className="min-w-0 flex-1 bg-transparent text-sm uppercase tracking-wide text-brown placeholder:text-brown/45 focus:outline-none"
              />
              <button type="submit" className="pl-4 text-[11px] font-bold uppercase tracking-[0.22em] text-brown hover:opacity-60">
                OK
              </button>
            </form>
            <div className="flex items-center gap-4 text-brown">
              <a href="#" aria-label="Instagram" className="hover:opacity-60">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" className="text-[16px] font-bold leading-none hover:opacity-60">
                ♪
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-60">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-1 grid max-w-[1400px] grid-cols-1 items-end gap-6 md:grid-cols-[240px_1fr_240px]">
          <Link href="/" className="block w-[210px] max-w-full">
            <Image
              src="/images/logo.png"
              alt="Moulin de Balme"
              width={210}
              height={210}
              className="h-auto w-full object-contain mix-blend-multiply"
            />
          </Link>
          <p className="pb-2 text-center text-xs text-brown/45">
            © {new Date().getFullYear()} Le Moulin de Balme — Tous droits réservés — Site by{" "}
            <a href="https://orion-studio.fr" className="underline hover:text-brown">
              Orion Studio
            </a>
          </p>
          <div aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
