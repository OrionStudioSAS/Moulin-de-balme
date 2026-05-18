import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
