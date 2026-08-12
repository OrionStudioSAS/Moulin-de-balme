export type FlourClassificationProductMap = Readonly<Record<string, string>>;

export interface FlourClassificationCard {
  type: "55" | "65" | "80" | "150";
  designation: string;
  ashRate: string;
  usageIdeas: string;
  productsBySlug: FlourClassificationProductMap;
}

export interface FlourClassificationSource {
  label: string;
  href: string;
}

/**
 * Versioned editorial and catalog mapping contract approved for T17 V1 review.
 *
 * Product associations are keyed by stable, explicitly reviewed catalog slugs.
 * They must never be inferred from a product name or another catalog field.
 * Any content, source, type, or mapping change requires a new reviewed version.
 */
export const FLOUR_CLASSIFICATION_CONTENT_V1 = {
  version: "pauline-814330a-v1",
  heading: "Comprendre les types de farine",
  introduction:
    "Le « T » se lit « type ». Pour les farines de blé, chaque type correspond à une plage de taux de cendres, exprimée en pourcentage de matière sèche. Ce taux est déterminé par incinération et il est corrélé à la quantité de matières minérales de la farine. Dans cette classification, un type plus élevé correspond à un taux de cendres plus élevé.",
  cardsHeading: "Repères pour nos farines de blé",
  cards: [
    {
      type: "55",
      designation: "Farine blanche",
      ashRate: "De 0,50 % à 0,60 % de matière sèche",
      usageIdeas: "Pain, biscottes et viennoiseries",
      productsBySlug: {
        "farine-t55": "Farine T55",
        "farine-gruau-t55": "Farine de gruau T55",
      },
    },
    {
      type: "65",
      designation: "Farine blanche",
      ashRate: "De 0,62 % à 0,75 % de matière sèche",
      usageIdeas: "Pain de tradition française et biscuiterie",
      productsBySlug: {
        "farine-ble-t65": "Farine de blé T65",
        "farine-t65-bio": "Farine T65 Bio",
        "farine-ble-t65-label-rouge": "Farine de blé T65 Label Rouge",
      },
    },
    {
      type: "80",
      designation: "Farine bise",
      ashRate: "De 0,75 % à 0,90 % de matière sèche",
      usageIdeas: "Pain bis et autres applications spéciales",
      productsBySlug: {
        "farine-ble-t80": "Farine de blé T80",
        "farine-ble-t80-label-rouge": "Farine de blé T80 Label Rouge",
        "farine-ble-bio-t80": "Farine de blé bio T80",
        "farine-ble-t80-label-rouge-classique":
          "Farine de blé T80 Label Rouge classique",
      },
    },
    {
      type: "150",
      designation: "Farine complète",
      ashRate: "Au-dessus de 1,40 % de matière sèche",
      usageIdeas: "Pains complets, spéciaux et autres",
      productsBySlug: {
        "farine-t150-complete": "Farine T150 complète",
        "farine-ble-bio-t150": "Farine de blé bio T150",
      },
    },
  ] satisfies readonly FlourClassificationCard[],
  scopeNote:
    "Ces repères concernent ici les farines de blé. Les types indiqués sur nos farines de seigle et d'épeautre ne sont pas comparés dans ce guide tant que leurs données de référence ne sont pas confirmées.",
  sourcesConsultedOn: "12 août 2026",
  sources: [
    {
      label: "Arrêté du 13 juillet 1963 — types de farine de blé",
      href: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000272197/",
    },
    {
      label: "FranceAgriMer — enquête sur les types de farines",
      href: "https://www.franceagrimer.fr/sites/default/files/rdd/documents/ETU-CER-farine%202010_2.pdf",
    },
    {
      label: "AFNOR — NF EN ISO 2171",
      href: "https://www.boutique.afnor.org/fr-fr/norme/nf-en-iso-2171/cereales-legumineuses-et-produits-derives-determination-du-taux-de-cendres-/fa195241/343572",
    },
    {
      label: "Ministère de l'Agriculture — cahier des charges Farine de meule",
      href: "https://info.agriculture.gouv.fr/boagri/document_administratif-2d4af2a0-4aa8-4ae2-9182-a99510800702/telechargement",
    },
  ] satisfies readonly FlourClassificationSource[],
} as const;
