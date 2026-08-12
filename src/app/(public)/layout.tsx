import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideCart from "@/components/SideCart";
import { CartProvider } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), subcategory:subcategories(*)")
    .eq("is_available", true)
    .order("sort_order");
  const recommendationProducts = error ? null : (data as Product[]);

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
      <SideCart products={recommendationProducts} />
    </CartProvider>
  );
}
