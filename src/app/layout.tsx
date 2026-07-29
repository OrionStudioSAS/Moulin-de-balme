import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Le Moulin de Balme® — Boulangerie Artisanale",
  description:
    "Pains, viennoiseries et pâtisseries façonnés à la main. Boulangerie artisanale à Paris. Click & Collect disponible.",
  openGraph: {
    title: "Le Moulin de Balme®",
    description: "Boulangerie artisanale — Pains au levain, viennoiseries, pâtisseries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cormorant.variable}>
      <body className="min-h-screen flex flex-col bg-cream text-brown">
        {children}
      </body>
    </html>
  );
}
