import Image from "next/image";

const H2 = "text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none";

export default function LaMaisonPage() {
  return (
    <div className="bg-cream">

      {/* ─── 1. HERO ─── */}
      <section className="relative overflow-hidden mt-[-64px] h-[465px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-banner.png"
            alt="Le Moulin de Balme"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 md:px-12 pb-16 pt-40">
          <h1 className={`${H2} text-white mb-3`}>
            Moulin<br />de Balme®
          </h1>
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/60 mb-3">
            Le Moulin de Balme anciennement Le Fournil de Lisa
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            Une boutique au 7 avenue Alsace-Lorraine. Et toute une histoire celle d&apos;un lieu
            qui change de mains sans jamais perdre son âme.
          </p>
        </div>
      </section>

      {/* ─── 2. UNE ADRESSE QUI A UNE HISTOIRE ─── */}
      <section className="bg-cream px-6 md:px-12 py-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1400px] mx-auto overflow-hidden bg-white">
        {/* Photo gauche */}
        <div className="relative min-h-[400px] md:min-h-[600px] bg-brown/20">
          <Image
            src="/images/histoire-before-photo.png"
            alt="Le 7, avenue Alsace-Lorraine — archives"
            fill
            className="object-cover object-center grayscale"
          />
        </div>

        {/* Texte droite */}
        <div className="px-6 md:px-12 py-16 flex flex-col justify-center gap-6">
          <div>
            <h2 className={`${H2} text-black mb-3`}>
              Une adresse<br />qui a une<br />histoire
            </h2>
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-brown/60">
              Le 7, avenue Alsace-Lorraine
            </p>
          </div>
          <div className="text-sm text-black/60 leading-relaxed space-y-4 max-w-md">
            <p>
              Au bas de l&apos;avenue Alsace-Lorraine, à deux pas de la gare de Brive, il y a une
              boulangerie depuis aussi longtemps que les Brivistes s&apos;en souviennent. Une boutique
              de quartier, une de celles qu&apos;on ne remarque plus parce qu&apos;elle a toujours été là —
              et c&apos;est précisément ce qui en fait le charme.
            </p>
            <p>
              Pendant des années, elle a porté le nom de Fournil de la Poste, en hommage au
              bureau de poste voisin. Puis elle est devenue le Fournil de Lisa, cette boulangerie
              aimée du quartier qui a nourri toute une génération de Brivistes — leurs
              petits-déjeuners, leurs goûters d&apos;enfance, leurs dimanches en famille.
            </p>
            <p>
              En 2023, après des années de service, le Fournil de Lisa ferme ses portes. Le
              rideau reste baissé près d&apos;un an. Le quartier, lui, attend.
            </p>
          </div>
        </div>
      </div>
      </section>

      {/* ─── 3. Instagram + Presse ─── */}

    </div>
  );
}
