import Link from "next/link";
import { FLOUR_CLASSIFICATION_CONTENT_V1 } from "@/content/flour-classification";

const content = FLOUR_CLASSIFICATION_CONTENT_V1;

export default function FlourClassificationGuide() {
  return (
    <section
      aria-labelledby="flour-classification-heading"
      className="border-t border-brown/10 bg-cream-dark"
      data-content-version={content.version}
      data-testid="flour-classification-guide"
    >
      <div
        className="mx-auto max-w-[1120px] px-4 py-12 md:px-6 md:py-16 lg:px-[34px] lg:py-20 min-[1188px]:px-0"
        data-testid="flour-classification-content"
      >
        <div className="max-w-[820px]">
          <h2
            id="flour-classification-heading"
            className="text-[32px] font-normal leading-[1.05] tracking-normal text-brown md:text-[44px] lg:text-[60px]"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-sm leading-6 text-brown/80 md:text-base md:leading-7">
            {content.introduction}
          </p>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-brown md:mt-10">
            {content.cardsHeading}
          </p>
        </div>

        <ol
          className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-5"
          data-testid="flour-classification-grid"
        >
          {content.cards.map((card) => (
            <li
              key={card.type}
              className="flex min-w-0 flex-col border border-brown/10 bg-cream p-5 text-brown even:bg-cream-dark md:p-6"
              data-flour-type={card.type}
            >
              <h3 className="text-3xl font-bold uppercase leading-none tracking-[0.016em]">
                Type {card.type}
              </h3>
              <dl className="mt-6 flex flex-1 flex-col gap-5 text-sm leading-5">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown/60">
                    Appellation :
                  </dt>
                  <dd className="mt-1 font-medium">{card.designation}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown/60">
                    Taux de cendres :
                  </dt>
                  <dd className="mt-1">{card.ashRate}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown/60">
                    Idées d&apos;usage :
                  </dt>
                  <dd className="mt-1">{card.usageIdeas}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown/60">
                    Produits associés :
                  </dt>
                  <dd className="mt-2">
                    <ul className="flex min-w-0 flex-col gap-1">
                      {Object.entries(card.productsBySlug).map(([slug, name]) => (
                        <li key={slug} className="min-w-0">
                          <Link
                            href={`/produits/${slug}`}
                            className="inline-flex min-h-11 max-w-full items-center break-words underline decoration-brown/30 underline-offset-4 hover:decoration-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                          >
                            {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-l-2 border-gold pl-4 text-sm leading-6 text-brown/80 md:max-w-4xl">
          {content.scopeNote}
        </p>

        <div className="mt-8 border-t border-brown/15 pt-5 text-xs leading-5 text-brown/65">
          <p className="font-bold uppercase tracking-[0.15em]">
            Sources consultées le {content.sourcesConsultedOn}
          </p>
          <ul className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-5">
            {content.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  className="inline-flex min-h-11 items-center underline decoration-brown/30 underline-offset-4 hover:text-brown hover:decoration-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
