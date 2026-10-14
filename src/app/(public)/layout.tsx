import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideCart from "@/components/SideCart";
import { CartProvider } from "@/lib/cart-context";
import { getProduits } from "@/lib/contenu/donnees";
import type { Product } from "@/types";

// Le contenu est lu depuis GitHub (mis en cache et invalidé par l'admin) et les dates « du jour » ne doivent pas être figées au build.
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recommendationProducts: Product[] | null = await getProduits({ disponibles: true }).catch(() => null);

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
      <SideCart products={recommendationProducts} />
    </CartProvider>
  );
}
