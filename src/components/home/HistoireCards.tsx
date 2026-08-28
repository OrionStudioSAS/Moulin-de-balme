import StoryCardsSlider from "@/components/StoryCardsSlider";
import type { StoryCard } from "@/components/StoryCardsSlider";

const CARDS: StoryCard[] = [
  {
    label: "L'héritage de Lisa",
    image: "/images/histoire-photo.png",
    imageAlt: "Le Fournil de Lisa",
    title: "Hommage au Fournil de Lisa",
    text: "Avant d'écrire notre propre histoire, nous tenons à rendre hommage à celle qui nous a précédés. Le Fournil de Lisa a été pendant des années l'un des repères du bas de l'avenue Alsace-Lorraine. Une boulangerie sincère, généreuse, où l'on entrait pour une baguette et où l'on ressortait avec des nouvelles du quartier.\n\nLisa et son équipe ont façonné l'âme du lieu. Les habitudes des clients, les odeurs du matin, la disposition de la vitrine — tout cela est leur héritage. Quand nous avons repris la boutique au printemps 2024, nous avons voulu honorer cette mémoire : en gardant les murs, en préservant l'esprit de proximité, en accueillant les anciens clients comme s'ils n'étaient jamais partis.\n\nSi vous étiez fidèle au Fournil de Lisa, vous êtes ici chez vous.",
  },
  {
    label: "La Renaissance",
    image: "/images/histoire-photo.png",
    imageAlt: "La boutique du Moulin de Balme",
    title: "Printemps 2025",
    text: "Au printemps 2024, après une année de fermeture, la boutique du 7 avenue Alsace-Lorraine retrouve la vie. Stéphane et Tomoko Reinat poussent la porte, encore en travaux, et imaginent ce qu'elle pourrait devenir.\n\nDe retour de quinze années passées à enseigner la boulangerie française à Tokyo, Hong Kong et Shanghai, Stéphane cherchait depuis des mois un fournil à reprendre. Il voulait un quartier vivant, une clientèle fidèle, un four qui en avait vu d'autres. Brive cochait toutes les cases.\n\nQuelques semaines de chantier plus tard — un coup de peinture, un mobilier repensé par Tomoko, une nouvelle enseigne — la boutique rouvre. Elle s'appelle désormais Le Moulin de Balme.",
  },
  {
    label: "Le Grand Départ",
    image: "/images/histoire-photo.png",
    imageAlt: "Tokyo — Le Cordon Bleu",
    title: "Tokyo, Premier Exil",
    text: "En 2009, une opportunité change tout. Le Cordon Bleu Tokyo cherche un formateur français pour transmettre le savoir-faire de la boulangerie traditionnelle à des élèves japonais. Stéphane n'hésite pas : il embarque pour le Japon avec quelques outils, un livre de recettes, et l'envie d'apprendre autant qu'il enseignera.\n\nAu Japon, il découvre une autre forme d'exigence. Les élèves japonais cherchent la perfection du geste, la propreté absolue, la mesure au gramme près. Lui leur apporte la patience française, la fermentation longue, la confiance dans l'imperfection. Cette rencontre, il ne l'oubliera jamais.\n\nC'est aussi à Tokyo qu'il rencontre Tomoko, qui deviendra son épouse, sa partenaire, et la pâtissière du futur Fournil de Balme.",
  },
];

export default function HistoireCards() {
  return <StoryCardsSlider cards={CARDS} />;
}
