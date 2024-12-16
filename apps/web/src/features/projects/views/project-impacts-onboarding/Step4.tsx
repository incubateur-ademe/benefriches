import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
};

const Step4Indicator = ({ className }: { className: ClassValue }) => {
  return (
    <div
      className={classNames(
        "tw-relative",
        "after:tw-content-['_']",
        "after:tw-absolute",
        "after:tw-h-[24px]",
        "after:tw-w-[50px]",
        "after:tw-bg-[url('/img/pictograms/project-impacts-onboarding/step4-designation-arrow.svg')]",
        "after:tw-bg-contain",
        "after:tw-bg-no-repeat",
        "after:tw-bottom-0",
        "after:tw-right-0",
        className,
      )}
    >
      <img
        width={636}
        height={552}
        src="/img/pictograms/project-impacts-onboarding/step4-indicateur.png"
        aria-hidden="true"
        alt="pictogramme graphique indicateur"
        className="tw-w-full tw-h-auto lg:tw-px-11"
      />
    </div>
  );
};

export default function Step4({ onNextClick, onBackClick }: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6 tw-items-start">
      <div className="tw-hidden md:tw-block tw-w-1/3">
        <Step4Indicator className="tw-mx-auto after:-tw-right-3" />
      </div>

      <div className="md:tw-w-2/3">
        <h1 className="tw-text-[32px]">
          Les indicateurs sont <span className="tw-bg-[#E3E3FD]">cliquables</span>.
        </h1>
        <p className="tw-text-lg">
          Dans la vue graphique comme dans la vue liste, vous pouvez cliquer sur la plupart des
          encadrés. Ils ouvrent une pop in qui contient plus d’informations sur l’indicateur
          (définition, données utilisées, mode de calcul, sources, etc.).
        </p>
        <Step4Indicator className="md:tw-hidden tw-w-2/3 after:tw-left-16 after:-tw-bottom-4 after:tw-rotate-12" />
        <img
          className="tw-my-6 tw-max-w-full tw-ml-auto tw-w-auto"
          src="/img/pictograms/project-impacts-onboarding/step4-popin.png"
          aria-hidden="true"
          alt="pictogramme graphique popin"
        />
        <div className="tw-mt-5">
          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="between"
            buttons={[
              {
                children: "Retour",
                priority: "secondary",
                onClick: onBackClick,
              },
              {
                priority: "primary",
                children: "Consulter les impacts",
                onClick: onNextClick,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
