// import { ChevronLeft, ChevronRight } from "lucide-react";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState, useRef } from "react";

import Badge from "@/shared/views/components/Badge/Badge";

import SectionTitle from "./SectionTitle";

type Testimony = {
  projectLocation: string;
  imgSrc: string;
  fileUrl?: string;
  projectType: string;
  testimony: string;
  author: string;
};

const testimonies: Testimony[] = [
  {
    projectLocation: "Coop Habitat Bourgogne",
    projectType: "🏡 Projet urbain",
    imgSrc: "/img/testimonies/coop-habitat-bourgogne.svg",
    testimony:
      "L'outil Bénéfriches m'a permis d'objectiver l'impact de nos opérations sur le foncier, je l'utilise comme un outil de construction de mon projet. J'intègre les données Bénéfriches dans mes PPT de présentation aux élus : recettes fiscales, améliorations du cadre de vie, impacts sociaux, émissions de CO2-eq évitées, kilomètres évités... ce sont des données qui marquent les élus.",
    author: "Cyril Lagarde, Directeur général",
  },
  {
    projectLocation: "Grand Paris Sud Est Avenir",
    imgSrc: "/img/testimonies/grand-paris-sudest.svg",
    projectType: "🏢 Zone d'activité économique",
    testimony:
      "L'utilisation de l'outil Bénéfriches a permis à Grand Paris Sud Est Avenir de développer une approche plus large de la reconquête de la friche France Telecom de Noiseau, en développant une analyse coûts-avantage globale, qui dépasse la seule conception financière de l'opération.",
    author: "Alice Sapir, Responsable d'opérations",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-gpsea.pdf",
  },
  {
    projectLocation: "Balaruc-les-Bains",
    imgSrc: "/img/testimonies/balaruc.svg",
    projectType: "🏡 Projet urbain",
    testimony:
      "L'outil Bénéfriches nous a permis de mieux apprécier les impacts et les bénéfices de l'opération. Nous avons également apprécié les temps d'échanges avec les autres porteurs de projet qui ne travaillaient pas sur les mêmes thématiques que nous.",
    author: "Julie Bastide et Yan Renaut, Chargés d'opérations",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-balaruc.pdf",
  },
  {
    projectLocation: "Melun Val de Seine",
    imgSrc: "/img/testimonies/melun-val-de-seine.svg",
    projectType: "🏢 Zone d'activité économique",
    testimony:
      "L'outil nous a permis d'aborder les bénéfices socio-économiques d'un projet de développement économique. Il nous a permis d'en tirer des enseignements applicables sur d'autres fonciers de zones d'activité économiques. Il deviendra un outil au service d'une stratégie de requalification des ZAE de l'agglomération.",
    author: "Typhaine Paris, Chargée de mission Aménagement",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-camvs-site-a.pdf",
  },
];

type TestimonyCardProps = {
  testimony: Testimony;
  className?: string;
};

function TestimonyCard({ testimony, className }: TestimonyCardProps) {
  return (
    <div
      className={`tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-8 tw-flex tw-gap-8 tw-min-w-[700px] tw-h-auto ${className || ""}`}
    >
      {/* Logo column */}
      <div className="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center tw-w-32">
        <img src={testimony.imgSrc} alt="" className="tw-max-w-full tw-object-contain" />
      </div>

      <div className="tw-w-px tw-bg-gray-200 tw-flex-shrink-0"></div>

      <div className="tw-flex tw-flex-col tw-flex-1 tw-min-h-[200px]">
        <div className="tw-mb-6">
          <Badge style="blue">{testimony.projectType}</Badge>
        </div>

        <blockquote className="tw-mb-6 tw-m-0 tw-font-medium tw-text-lg">
          "{testimony.testimony}"
        </blockquote>

        <div className="tw-text-sm">{testimony.author}</div>
        {testimony.fileUrl && (
          <Button
            className="tw-mt-6"
            priority="secondary"
            linkProps={{
              href: testimony.fileUrl,
              rel: "noopener noreferrer",
              target: "_blank",
              title: `Télécharger le cas d'étude du projet à ${testimony.projectLocation}`,
              "aria-label": `Télécharger le cas d'étude du projet à ${testimony.projectLocation}`,
            }}
          >
            Télécharger le cas d'étude
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TestimoniesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 600 + 24; // card width + gap
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

  return (
    <section className="tw-bg-[#64C7ED] tw-py-20">
      <div className="fr-container">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-[60px]">
          <SectionTitle className="tw-m-0">Ils sont convaincus par Bénéfriches</SectionTitle>
          <div>
            <button
              aria-label="Témoignage précédent"
              className="tw-border tw-border-solid tw-border-[#000091] tw-rounded-lg tw-p-2 tw-mr-4"
              onClick={goToPrevious}
            >
              <span className={fr.cx("fr-icon-arrow-left-s-line")} aria-hidden="true"></span>
            </button>
            <button
              aria-label="Témoignage suivant"
              className="tw-border tw-border-solid tw-border-[#000091] tw-rounded-lg tw-p-2"
              onClick={goToNext}
            >
              <span className={fr.cx("fr-icon-arrow-right-s-line")} aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="tw-flex tw-gap-6 tw-overflow-x-auto tw-scrollbar-hide tw-scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonies.map((testimony, index) => (
            <TestimonyCard
              key={testimony.author}
              testimony={testimony}
              className={index === 0 ? "tw-ml-0" : ""}
            />
          ))}
        </div>

        <div className="tw-flex tw-mt-[60px] tw-gap-2">
          {testimonies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                scrollToIndex(index);
              }}
              className={`tw-w-3 tw-h-3 tw-rounded-full tw-transition-colors ${
                index === currentIndex ? "tw-bg-black" : "tw-bg-[#00000040] hover:tw-bg-gray-400"
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
