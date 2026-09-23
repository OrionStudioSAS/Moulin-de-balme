import Image from "next/image";
import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Nos produits",
    links: [
      { label: "Pain", href: "/produits?categorie=pain" },
      { label: "Viennoiseries", href: "/produits?categorie=viennoiseries" },
      { label: "Pâtisseries", href: "/produits?categorie=patisseries" },
      { label: "Salé", href: "/produits?categorie=sale" },
      { label: "Confitures", href: "/produits?categorie=confitures" },
      { label: "Farines", href: "/produits?categorie=farines" },
      { label: "Miel", href: "/produits?categorie=miel" },
      { label: "Tous les produits", href: "/produits" },
    ],
  },
  {
    title: "Le Moulin®",
    links: [
      { label: "Notre histoire", href: "/la-maison" },
      { label: "Savoir-faire", href: "/stephane-reinat" },
      { label: "La semaine", href: "/la-semaine" },
      { label: "Nos farines", href: "/#nos-farines" },
      { label: "Contactez-nous", href: "/#contact" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream text-brown">
      <div className="px-6 md:px-12 pt-14 pb-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-16">

          {/* Logo */}
          <div className="flex flex-col justify-start">
            <Link href="/" className="block w-[180px] max-w-full">
              <Image
                src="/images/logo.png"
                alt="Moulin de Balme"
                width={210}
                height={210}
                className="h-auto w-full object-contain mix-blend-multiply"
              />
            </Link>
          </div>

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
        </div>

        <div className="mx-auto mt-8 max-w-[1400px]">
          <p className="text-center text-xs text-brown/45">
            © {new Date().getFullYear()} Le Moulin de Balme — Tous droits réservés — Site by{" "}
            <a href="https://orion-studio.fr" className="underline hover:text-brown">
              Orion Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
