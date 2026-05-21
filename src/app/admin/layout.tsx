// Layout racine pour toute la section /admin
// Pas de Navbar ni Footer du site public
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
