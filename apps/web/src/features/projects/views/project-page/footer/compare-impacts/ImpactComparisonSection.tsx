import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";
import { SiteNature } from "shared";

import classNames, { ClassValue } from "@/shared/views/clsx";

import ImpactComparisonCardContent from "./ImpactComparisonCardContent";

type Props = {
  onSelectOption: (comparisonSiteNature: SiteNature) => void;
  siteNature: SiteNature;
};

// const StatuQuoContent = () => {
//   return (
//     <ImpactComparisonCardContent
//       title="Si le projet ne se fait pas"
//       imgSrc="/img/pictograms/site-nature/friche.svg"
//       descriptionItems={[
//         "💥 Des accidents sur la friche qui risquent de survenir",
//         "💰 Des mesures de sécurisation de la friche de plus en plus coûteuses",
//         "🏚️ Un cadre de vie déplaisant pour les riverains",
//         "Et pleins d’autres impacts.",
//       ]}
//     />
//   );
// };

const ProjectOnAgriculturalOperation = () => {
  return (
    <ImpactComparisonCardContent
      title="Ce projet sur une exploitation agricole"
      imgSrc="/img/pictograms/site-nature/agricultural-operation.svg"
      descriptionItems={[
        "👨‍🌾 Des emplois agricoles détruits",
        "🍂 Des sols qui absorberont moins d’eau et moins de carbone",
        "💥 Des accidents sur la friche qui risquent de survenir",
        "Et pleins d’autres impacts.",
      ]}
    />
  );
};

const ProjectOnNaturalArea = () => {
  return (
    <ImpactComparisonCardContent
      title="Ce projet sur une prairie"
      imgSrc="/img/pictograms/site-nature/natural-area.svg"
      descriptionItems={[
        "🚧 Des dépenses de construction et de VRD élevées",
        "🥀 Une biodiversité dégradée",
        "🍂 Des sols qui absorberont moins d’eau et moins de carbone",
        "Et pleins d’autres impacts.",
      ]}
    />
  );
};

const COMPARE_SITE_OPTIONS: { option: SiteNature; bgClassName: ClassValue; content: ReactNode }[] =
  [
    // {
    //   option: "statu_quo_scenario",
    //   bgClassName: "bg-[#E4D8E4] dark:bg-[#3a283b]",
    //   content: <StatuQuoContent />,
    // },
    {
      option: "AGRICULTURAL_OPERATION",
      bgClassName: "bg-[#E4E4D7] dark:bg-[#4a4b2e]",
      content: <ProjectOnAgriculturalOperation />,
    },
    {
      option: "NATURAL_AREA",
      bgClassName: "bg-[#D9E7DA] dark:bg-[#355737]",
      content: <ProjectOnNaturalArea />,
    },
  ] as const;

function ImpactComparisonSection({ onSelectOption, siteNature }: Props) {
  if (siteNature === "FRICHE") {
    return (
      <section className="mt-10 rounded-lg grid grid-flow-col grid-cols-[75%_repeat(3,373px)] sm:grid-cols-[25%_repeat(3,373px)] gap-10 overflow-x-scroll">
        <div className="bg-impacts-dark dark:bg-black p-6 rounded-2xl justify-center flex flex-col gap-4 font-bold">
          <span className="text-3xl">Le saviez-vous ?</span>
          <span className="text-xl">
            Ce projet sur cette friche aura des impacts socio-économiques bien meilleurs que...
          </span>
        </div>
        {COMPARE_SITE_OPTIONS.map(({ option, bgClassName, content }) => (
          <div
            key={option}
            className={classNames(
              bgClassName,
              "p-6",
              "rounded-2xl",
              "flex flex-col justify-around",
            )}
          >
            {content}

            <Button
              size="small"
              priority="secondary"
              onClick={() => {
                onSelectOption(option);
              }}
            >
              Comparer
            </Button>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="flex rounded-lg gap-6 px-6 py-10 mt-10 bg-white dark:bg-black border border-solid border-borderGrey">
      <img
        src="/img/pictograms/site-nature/friche.svg"
        width="80"
        height="80"
        aria-hidden="true"
        alt=""
        className={classNames("mb-2", "w-40 h-40")}
      />
      <div>
        <h3>Et si vous réalisiez ce projet sur une friche ?</h3>
        <h4 className={classNames("flex items-center gap-4", "text-xl", "font-bold")}>
          Ce projet sur une friche, c’est :
        </h4>
        {siteNature === "AGRICULTURAL_OPERATION" ? (
          <ul className="text-base list-none p-0 m-0">
            <li className="pb-4">✅ Des emplois agricoles préservés</li>
            <li className="pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="pb-4">Et pleins d’autres impacts.</li>
          </ul>
        ) : (
          <ul className="text-base list-none p-0 m-0">
            <li className="pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="pb-4">
              ✅ Un cadre de vie autour de la friche plus agréable pour les riverains
            </li>
            <li className="pb-4">Et pleins d’autres impacts.</li>
          </ul>
        )}

        <Button
          priority="primary"
          onClick={() => {
            onSelectOption("FRICHE");
          }}
        >
          Comparer
        </Button>
      </div>
    </section>
  );
}

export default ImpactComparisonSection;
