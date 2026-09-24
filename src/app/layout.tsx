import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.moulin-de-balme.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Le Moulin de Balme® — Boulangerie Artisanale à Brive-la-Gaillarde",
    template: "%s — Le Moulin de Balme®",
  },
  description:
    "Boulangerie artisanale à Brive-la-Gaillarde (Corrèze). Pains au levain, viennoiseries et pâtisseries façonnés à la main par Stéphane Reinat. Click & Collect disponible.",
  keywords: [
    "boulangerie Brive-la-Gaillarde",
    "boulangerie artisanale Corrèze",
    "pain au levain Brive",
    "viennoiseries Brive",
    "Moulin de Balme",
    "Stéphane Reinat boulanger",
    "click and collect boulangerie",
  ],
  authors: [{ name: "Le Moulin de Balme" }],
  creator: "Le Moulin de Balme",
  publisher: "Le Moulin de Balme",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Le Moulin de Balme®",
    title: "Le Moulin de Balme® — Boulangerie Artisanale à Brive-la-Gaillarde",
    description:
      "Boulangerie artisanale à Brive-la-Gaillarde. Pains au levain, viennoiseries et pâtisseries façonnés à la main. Click & Collect disponible.",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Le Moulin de Balme — Boulangerie artisanale à Brive-la-Gaillarde",
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Le Moulin de Balme",
  alternateName: "Le Fournil de Lisa",
  description:
    "Boulangerie artisanale à Brive-la-Gaillarde. Pains au levain, viennoiseries et pâtisseries façonnés à la main.",
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-banner.png`,
  logo: `${SITE_URL}/images/logo.png`,
  email: "moulindebalme@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7 avenue Alsace-Lorraine",
    addressLocality: "Brive-la-Gaillarde",
    postalCode: "19100",
    addressRegion: "Corrèze",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.1584,
    longitude: 1.5315,
  },
  priceRange: "€",
  servesCuisine: "Boulangerie artisanale française",
  hasMenu: `${SITE_URL}/produits`,
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-brown">
        {children}
      </body>
    </html>
  );
}
