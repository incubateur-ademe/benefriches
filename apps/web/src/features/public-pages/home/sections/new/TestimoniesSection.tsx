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
      className={`bg-white dark:bg-grey-dark rounded-2xl p-8 md:flex gap-8 min-w-[700px] h-auto ${className || ""}`}
    >
      <div className="shrink-0 my-auto w-32">
        <img src={testimony.imgSrc} alt="" className="max-w-full object-contain" />
      </div>

      <div className="hidden md:block w-px bg-gray-200 shrink-0" />

      <div className="flex flex-col flex-1 min-h-[200px]">
        <div className="mb-6">
          <Badge style="blue">{testimony.projectType}</Badge>
        </div>

        <blockquote className="mb-6 m-0 font-medium text-lg">"{testimony.testimony}"</blockquote>

        <div className="text-sm">{testimony.author}</div>
        {testimony.fileUrl && (
          <Button
            className="mt-6"
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

  return (
    <section className="bg-blue-light py-20">
      <div className="fr-container flex items-center justify-between mb-[60px]">
        <SectionTitle className="m-0">Ils sont convaincus par Bénéfriches</SectionTitle>
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
      </div>

      <div
        ref={scrollContainerRef}
        className="flex px-6 gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonies.map((testimony, index) => (
          <TestimonyCard
            key={testimony.author}
            testimony={testimony}
            className={index === 0 ? "ml-0" : ""}
          />
        ))}
      </div>

      <div className="flex mt-[60px] gap-2 fr-container">
        {testimonies.map((_, index) => (
          <button
            key={index}
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
    </section>
  );
}
