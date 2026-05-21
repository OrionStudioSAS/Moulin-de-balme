export default function ProductBadge({ badge }: { badge: "nouveau" | "bestseller" | "exclusif" }) {
  const styles = {
    nouveau: "bg-brown text-cream",
    bestseller: "bg-gold text-brown",
    exclusif: "bg-cream text-brown border border-brown/30",
  };
  const labels = {
    nouveau: "Nouveau",
    bestseller: "Bestseller",
    exclusif: "Exclusif",
  };
  return (
    <span className={`text-[10px] tracking-widests uppercase px-2.5 py-1 font-bold ${styles[badge]}`}>
      {labels[badge]}
    </span>
  );
}
