import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { type ReactNode, useRef, useState } from "react";

import TestimonyCard from "./TestimonyCard";
import { testimonies } from "./testimonies";

type Props = {
  /** Rendered on the left of the prev/next controls, in the carousel header row. */
  title?: ReactNode;
  /**
   * true  → edge-to-edge scroll area aligned on fr-container (landing pages, which render
   *         the carousel outside any container).
   * false → for use inside an existing fr-container (onboarding step 3).
   */
  fullBleed?: boolean;
  /**
   * "top"    → prev/next controls sit in their own header row above the cards (default,
   *            used when a `title` is also rendered there, e.g. the landing page section).
   * "bottom" → prev/next controls sit next to the dot indicators below the cards instead,
   *            so no separate header row is rendered (saves vertical space when there's no
   *            title, e.g. onboarding step 3).
   */
  arrowsPosition?: "top" | "bottom";
};

export default function TestimoniesCarousel({ title, fullBleed, arrowsPosition = "top" }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 660 + 24 + 24; // card width + gap + container horizontal padding
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const testimoniesLastIndex = testimonies.length - 1;

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : testimoniesLastIndex;
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < testimoniesLastIndex ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const arrowButtons = (
    <div>
      <Button
        aria-label="Témoignage précédent"
        priority="secondary"
        className="mr-4 px-2"
        onClick={goToPrevious}
      >
        <span className={fr.cx("fr-icon-arrow-left-s-line")} aria-hidden="true"></span>
      </Button>
      <Button
        priority="secondary"
        aria-label="Témoignage suivant"
        className="p-2"
        onClick={goToNext}
      >
        <span className={fr.cx("fr-icon-arrow-right-s-line")} aria-hidden="true"></span>
      </Button>
    </div>
  );

  return (
    <>
      {(title || arrowsPosition === "top") && (
        <div
          className={`${fullBleed ? "fr-container " : ""}flex items-center ${title ? "justify-between" : "justify-end"} mb-15`}
        >
          {title}
          {arrowsPosition === "top" && arrowButtons}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // Mirrors fr-container's left edge: fixed 1.5rem on narrow viewports,
          // (100vw - 78rem) / 2 + 1.5rem once the container starts centering itself.
          // 78rem = fr-container max-width (1248px at 16px root font size).
          ...(fullBleed
            ? {
                paddingLeft: "max(1.5rem, calc((100vw - 78rem) / 2 + 1.5rem))",
                paddingRight: "1.5rem",
              }
            : { paddingLeft: 0, paddingRight: 0 }),
        }}
      >
        {testimonies.map((testimony, index) => (
          <TestimonyCard
            key={testimony.author}
            testimony={testimony}
            className={index === 0 ? "ml-0" : ""}
          />
        ))}
      </div>

      <div
        className={`flex items-center mt-15${fullBleed ? " fr-container" : ""} ${
          arrowsPosition === "bottom" ? "justify-between" : "gap-2"
        }`}
      >
        <div className="flex gap-2">
          {testimonies.map(({ imgSrc }, index) => (
            <button
              key={imgSrc}
              onClick={() => {
                scrollToIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-black" : "bg-[#00000040] hover:bg-gray-400"
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>
        {arrowsPosition === "bottom" && arrowButtons}
      </div>
    </>
  );
}
