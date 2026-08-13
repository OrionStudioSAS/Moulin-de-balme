import Image from "next/image";
import { MOULIN_DE_COLAGNE_CONTENT_V1 } from "@/content/moulin-de-colagne";

const content = MOULIN_DE_COLAGNE_CONTENT_V1;

export default function MoulinDeColagneSection() {
  return (
    <section
      aria-labelledby="moulin-de-colagne-heading"
      className="bg-cream py-10 text-brown md:py-12 lg:py-14"
      data-content-version={content.version}
      data-testid="moulin-de-colagne-section"
    >
      <div
        className="mx-auto grid min-w-0 max-w-[1440px] grid-cols-1 px-4 md:px-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:px-[34px]"
        data-testid="moulin-de-colagne-layout"
      >
        <header className="min-w-0 lg:pl-3">
          <h2
            id="moulin-de-colagne-heading"
            className="text-[44px] font-normal uppercase leading-[44px] tracking-[0.016em] md:text-[56px] md:leading-[57px] lg:text-[80px] lg:leading-[81px]"
          >
            {content.heading}
          </h2>
          <p className="mt-1 text-[15px] uppercase leading-[19px] tracking-[0.016em] md:text-[17px] md:leading-[21px] lg:text-[20px] lg:leading-[22px]">
            {content.subtitle}
          </p>
        </header>

        <p
          className="mt-8 max-w-[560px] text-[15px] leading-[22px] md:mt-10 lg:mt-0 lg:max-w-[506px] lg:self-end lg:pl-3 lg:text-[13px] lg:leading-[15.6px]"
          data-testid="moulin-de-colagne-body"
        >
          {content.body}
        </p>

        <div
          className="relative mt-8 aspect-square min-w-0 overflow-hidden md:mt-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
          data-testid="moulin-de-colagne-media"
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) calc((min(100vw, 1440px) - 92px) / 2), (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)"
          />
        </div>
      </div>
    </section>
  );
}
