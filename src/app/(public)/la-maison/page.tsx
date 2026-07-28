import Image from "next/image";
import InstagramSection from "@/components/home/InstagramSection";

const H2 = "text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none";

export default function LaMaisonPage() {
  return (
    <div className="bg-cream">

      {/* ─── 1. HERO ─── */}
      <section className="relative overflow-hidden mt-[-64px] h-[calc(100vh-37px)]">
        <div className="absolute inset-0">
          <Image
            src="/images/maison-hero.jpg"
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
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60 mb-3">
            Le Moulin de Balme anciennement Le Fournil de Lisa
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            Une boutique au 7 avenue Alsace-Lorraine. Et toute une histoire celle d&apos;un lieu
            qui change de mains sans jamais perdre son âme.
          </p>
        </div>
      </section>

      {/* ─── 2. UNE ADRESSE QUI A UNE HISTOIRE ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Photo gauche */}
        <div className="relative min-h-[400px] md:min-h-[600px] bg-brown/20">
          <Image
            src="/images/histoire-photo.png"
            alt="Le 7, avenue Alsace-Lorraine — archives"
            fill
            className="object-cover object-center grayscale"
          />
        </div>

        {/* Texte droite */}
        <div className="px-10 md:px-16 py-16 flex flex-col justify-center gap-6">
          <div>
            <h2 className={`${H2} text-black mb-3`}>
              Une adresse<br />qui a une<br />histoire
            </h2>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-brown/60">
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
      </section>

      {/* ─── 3. DEUX CARTES — L'HÉRITAGE / LA RENAISSANCE ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">

        {/* L'HÉRITAGE DE LISA — carte sombre */}
        <div className="relative overflow-hidden bg-[#1A1410] min-h-[560px] flex flex-col">
          {/* Image en haut */}
          <div className="relative flex-1 min-h-[240px]">
            <Image
              src="/images/histoire-photo.png"
              alt="L'héritage de Lisa"
              fill
              className="object-cover object-center grayscale opacity-60"
            />
          </div>
          {/* Texte en bas */}
          <div className="px-10 py-10">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3">
              L&apos;héritage de Lisa
            </p>
            <h3 className={`${H2} text-white mb-5`}>
              Hommage<br />au Fournil<br />de Lisa
            </h3>
            <div className="text-xs text-white/60 leading-relaxed space-y-3 max-w-sm">
              <p>
                Avant d&apos;écrire notre propre histoire, nous tenons à rendre hommage à celle qui
                nous a précédés. Le Fournil de Lisa a été pendant des années l&apos;un des repères du
                bas de l&apos;avenue Alsace-Lorraine. Une boulangerie sincère, généreuse, où l&apos;on
                entrait pour une baguette et où l&apos;on ressortait avec des nouvelles du quartier.
              </p>
              <p>
                Lisa et son équipe ont façonné l&apos;âme du lieu. Les habitudes des clients, les
                odeurs du matin, la disposition de la vitrine — tout cela est leur héritage.
                Quand nous avons repris la boutique au printemps 2024, nous avons voulu honorer
                cette mémoire : en gardant les murs, en préservant l&apos;esprit de proximité, en
                accueillant les anciens clients comme s&apos;ils n&apos;étaient jamais partis.
              </p>
              <p className="text-white/80 font-medium">
                Si vous étiez fidèle au Fournil de Lisa, vous êtes ici chez vous.
              </p>
            </div>
          </div>
        </div>

        {/* LA RENAISSANCE — carte claire */}
        <div className="relative overflow-hidden bg-[#C4A882] min-h-[560px] flex flex-col">
          {/* Image en haut */}
          <div className="relative flex-1 min-h-[240px]">
            <Image
              src="/images/renaissance-photo.jpg"
              alt="La Renaissance — Printemps 2025"
              fill
              className="object-cover object-center"
            />
          </div>
          {/* Texte en bas */}
          <div className="px-10 py-10">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/60 mb-3">
              La Renaissance
            </p>
            <h3 className={`${H2} text-brown mb-5`}>
              Printemps<br />2025
            </h3>
            <div className="text-xs text-brown/80 leading-relaxed space-y-3 max-w-sm">
              <p>
                Au printemps 2024, après une année de fermeture, la boutique du 7 avenue
                Alsace-Lorraine retrouve la vie. Stéphane et Tomoko Reinat poussent la porte,
                encore en travaux, et imaginent ce qu&apos;elle pourrait devenir.
              </p>
              <p>
                De retour de quinze années passées à enseigner la boulangerie française à Tokyo,
                Hong Kong et Shanghai, Stéphane cherchait depuis des mois un fournil à reprendre.
                Pas n&apos;importe où, pas n&apos;importe comment. Il voulait un quartier vivant, une
                clientèle fidèle, un four qui en avait vu d&apos;autres. Brive cochait toutes les cases.
              </p>
              <p>
                Quelques semaines de chantier plus tard — un coup de peinture, un mobilier
                repensé par Tomoko, une nouvelle enseigne — la boutique rouvre. Elle s&apos;appelle
                désormais Le Moulin de Balme.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ─── 4. Instagram + Presse ─── */}
      <InstagramSection />

    </div>
  );
}
