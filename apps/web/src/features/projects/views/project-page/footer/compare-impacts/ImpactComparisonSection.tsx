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
    //   bgClassName: "tw-bg-[#E4D8E4] dark:tw-bg-[#3a283b]",
    //   content: <StatuQuoContent />,
    // },
    {
      option: "AGRICULTURAL_OPERATION",
      bgClassName: "tw-bg-[#E4E4D7] dark:tw-bg-[#4a4b2e]",
      content: <ProjectOnAgriculturalOperation />,
    },
    {
      option: "NATURAL_AREA",
      bgClassName: "tw-bg-[#D9E7DA] dark:tw-bg-[#355737]",
      content: <ProjectOnNaturalArea />,
    },
  ] as const;

function ImpactComparisonSection({ onSelectOption, siteNature }: Props) {
  if (siteNature === "FRICHE") {
    return (
      <section className="tw-mt-10 tw-rounded-lg tw-grid tw-grid-flow-col tw-grid-cols-[75%_repeat(3,373px)] sm:tw-grid-cols-[25%_repeat(3,373px)] tw-gap-10 tw-overflow-x-scroll">
        <div className="tw-bg-impacts-dark dark:tw-bg-black tw-p-6 tw-rounded-2xl tw-justify-center tw-flex tw-flex-col tw-gap-4 tw-font-bold">
          <span className="tw-text-3xl">Le saviez-vous ?</span>
          <span className="tw-text-xl">
            Ce projet sur cette friche aura des impacts socio-économiques bien meilleurs que...
          </span>
        </div>
        {COMPARE_SITE_OPTIONS.map(({ option, bgClassName, content }) => (
          <div
            key={option}
            className={classNames(
              bgClassName,
              "tw-p-6",
              "tw-rounded-2xl",
              "tw-flex tw-flex-col tw-justify-around",
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
    <section className="tw-flex tw-rounded-lg tw-gap-6 tw-px-6 tw-py-10 tw-mt-10 tw-bg-white dark:tw-bg-black tw-border tw-border-solid tw-border-borderGrey">
      <img
        src="/img/pictograms/site-nature/friche.svg"
        width="80"
        height="80"
        aria-hidden="true"
        alt=""
        className={classNames("tw-mb-2", "tw-w-40 tw-h-40")}
      />
      <div>
        <h3>Et si vous réalisiez ce projet sur une friche ?</h3>
        <h4
          className={classNames("tw-flex tw-items-center tw-gap-4", "tw-text-xl", "tw-font-bold")}
        >
          Ce projet sur une friche, c’est :
        </h4>
        {siteNature === "AGRICULTURAL_OPERATION" ? (
          <ul className="tw-text-base tw-list-none tw-p-0 tw-m-0">
            <li className="tw-pb-4">✅ Des emplois agricoles préservés</li>
            <li className="tw-pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="tw-pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="tw-pb-4">Et pleins d’autres impacts.</li>
          </ul>
        ) : (
          <ul className="tw-text-base tw-list-none tw-p-0 tw-m-0">
            <li className="tw-pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="tw-pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="tw-pb-4">
              ✅ Un cadre de vie autour de la friche plus agréable pour les riverains
            </li>
            <li className="tw-pb-4">Et pleins d’autres impacts.</li>
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
