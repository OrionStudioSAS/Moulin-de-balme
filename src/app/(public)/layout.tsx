import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideCart from "@/components/SideCart";
import { CartProvider } from "@/lib/cart-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
      <SideCart />
    </CartProvider>
  );
}
