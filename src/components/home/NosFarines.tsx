import Link from "next/link";

const FARINES = [
  { name: "Farine de blé T65", detail: "Moulin à vent", color: "bg-[#E8D5B0]", tag: "FARINE BIO" },
  { name: "Farine de seigle", detail: "Moulin de Balme", color: "bg-[#C4A882]", tag: "FARINE DE SEIGLE" },
  { name: "Farine T80", detail: "Moulin St-Jean", color: "bg-[#D4B896]", tag: "FARINE T80" },
  { name: "Farine intégrale T150", detail: "Grains anciens", color: "bg-[#6B4A35]", tag: "FARINE CARAMEL" },
  { name: "Sac Moulin Petit", detail: "Usage particulier", color: "bg-[#3D2B1F]", tag: "MOULT PETIT ÉPEAUTRE BIO NATURE BIO" },
  { name: "Sac Artisan", detail: "Pro et épiceries", color: "bg-[#8C7B6B]", tag: "MOULT KHORASAN BIO NATUREL BIO" },
];

export default function NosFarines() {
  return (
    <section id="nos-farines" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
          <div>
            <p className="label-tag mb-2">Nos farines</p>
            <h2 className="section-title">
              Des farines sélectionnées
            </h2>
          </div>
          <Link href="/produits?categorie=farines" className="btn-outline self-start">
            Voir plus
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FARINES.map((f) => (
            <div key={f.name} className="group cursor-pointer">
              <div className={`aspect-[2/3] ${f.color} mb-3 flex items-end p-3 hover:opacity-90 transition-opacity`}>
                <p className="text-xs text-cream/80 tracking-wider leading-tight">{f.tag}</p>
              </div>
              <p className="text-xs font-medium tracking-wider text-brown">{f.name}</p>
              <p className="label-tag mt-1">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
