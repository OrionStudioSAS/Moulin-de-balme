import Link from "next/link";
import Image from "next/image";

export default function HistoireSection() {
  return (
    <section id="histoire" className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Photo — gauche, pleine hauteur */}
        <div className="relative min-h-[500px] md:min-h-[700px] bg-brown/10 overflow-hidden">
          <Image
            src="/images/histoire-photo.jpg"
            alt="Stéphane et Tomoko Reinat — Le Moulin de Balme"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Texte — droite */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-16 md:py-20">
          <h2 className="text-[clamp(3.5rem,6vw,6rem)] font-bold uppercase tracking-tight leading-none text-black mb-5">
            Le Moulin®
          </h2>

          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-black mb-10 leading-relaxed max-w-md">
            De Tokyo à Brive&nbsp;... le retour aux sources d&apos;un globe-trotter
          </p>

          <div className="space-y-5 text-sm text-black leading-relaxed max-w-md mb-12">
            <p>
              Une réouverture aux allures de retour aux sources pour le boulanger lotois Stéphane
              Reinat, originaire de Saint-Denis-lès-Martel, et un sacré changement de décor pour sa
              compagne japonaise, Tomoko, originaire de Yokohama, ville de 3,7 millions d&apos;habitants.
            </p>
            <p>
              Le couple s&apos;est justement rencontré à l&apos;époque où Stéphane Reinat officiait comme
              professeur de boulangerie à l&apos;école du Cordon Bleu, à Tokyo. &laquo;&nbsp;Elle a été une de mes
              élèves&nbsp;&raquo;, sourit l&apos;artisan, qui a fait la plus grande partie de sa carrière en Asie.
            </p>
            <p>
              Après un apprentissage &laquo;&nbsp;classique&nbsp;&raquo; dans l&apos;Hexagone, avec des expériences en
              région parisienne puis dans les Alpes-de-Haute-Provence, le Lotois s&apos;envole pour le
              pays du Soleil levant en 2006.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/collections"
              className="border border-black text-black text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-black hover:text-white transition-colors"
            >
              Découvrir la boulangerie
            </Link>
            <Link
              href="/#stephane-reinat"
              className="border border-black text-black text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-black hover:text-white transition-colors"
            >
              Découvrir le boulanger
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
